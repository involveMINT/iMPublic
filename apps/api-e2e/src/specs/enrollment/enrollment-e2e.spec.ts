import { ProjectService } from '@involvemint/server/core/application-services';
import {
  EnrollmentRepository,
  PassportDocumentRepository,
  ProjectDocumentRepository,
  ProjectRepository,
  ServeAdminRepository,
  ServePartnerRepository,
} from '@involvemint/server/core/domain-services';
import {
  calculateEnrollmentStatus,
  ChangeMaker,
  Enrollment,
  EnrollmentStatus,
  IChangeMakerOrchestration,
  IEnrollmentOrchestration,
  IProjectOrchestration,
  IUserOrchestration,
  Project,
  ServePartner,
} from '@involvemint/shared/domain';
import { parseDate } from '@involvemint/shared/util';
import { HttpStatus } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { createQuery, IParser } from '@involvemint/shared/domain';
import { ITestOrchestration } from '@orcha/testing';
import * as uuid from 'uuid';
import { AppTestModule } from '../../core/app-test.module';
import { DatabaseService } from '../../core/database.service';
import { createChangeMakerOrchestration } from '../change-maker/change-maker.orchestration';
import { createProjectOrchestration } from '../project/project.orchestration';
import { createServeAdmin } from '../serve-admin/serve-admin.helpers';
import { createServePartner } from '../serve-partner/serve-partner.helpers';
import { createUserOrchestration } from '../user/user.orchestration';
import { createEnrollmentOrchestration } from './enrollment.orchestration';
const { default: axios } = require('axios');

describe('ExchangePartner Orchestration Integration Tests', () => {
  let app: NestFastifyApplication;
  let db: DatabaseService;

  let userOrcha: ITestOrchestration<IUserOrchestration>;
  let enrollmentOrcha: ITestOrchestration<IEnrollmentOrchestration>;
  let cmOrcha: ITestOrchestration<IChangeMakerOrchestration>;
  let projectOrcha: ITestOrchestration<IProjectOrchestration>;

  let enrollmentRepo: EnrollmentRepository;
  let spRepo: ServePartnerRepository;
  let projectRepo: ProjectRepository;
  let saRepo: ServeAdminRepository;
  let passportRepo: PassportDocumentRepository;
  let projectDocRepo: ProjectDocumentRepository;

  let projectService: ProjectService;

  const creds = { id: 'email@email.com', password: 'GoodPwd@341' };
  let auth: { body: { token: string }; statusCode: HttpStatus };

  const cmQuery = createQuery<ChangeMaker>()({ id: true });
  let cmProfile: IParser<ChangeMaker, typeof cmQuery>;

  const spQuery = createQuery<ServePartner>()({ id: true });

  const projectQuery = createQuery<Project>()({ id: true });
  let project: IParser<Project, typeof projectQuery>;

  const enrollmentQuery = createQuery<Enrollment>()({
    id: true,
    dateApplied: true,
    dateApproved: true,
    dateDenied: true,
    dateRetired: true,
    dateSubmitted: true,
    acceptedWaiver: true,
    project: {
      requireCustomWaiver: true,
    },
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppTestModule],
      providers: [DatabaseService],
    }).compile();

    app = moduleRef.createNestApplication();
    db = moduleRef.get(DatabaseService);

    userOrcha = createUserOrchestration(app);
    enrollmentOrcha = createEnrollmentOrchestration(app);
    cmOrcha = createChangeMakerOrchestration(app);
    projectOrcha = createProjectOrchestration(app);

    spRepo = moduleRef.get(ServePartnerRepository);
    saRepo = moduleRef.get(ServeAdminRepository);
    projectRepo = moduleRef.get(ProjectRepository);
    enrollmentRepo = moduleRef.get(EnrollmentRepository);
    passportRepo = moduleRef.get(PassportDocumentRepository);
    projectDocRepo = moduleRef.get(ProjectDocumentRepository);

    projectService = moduleRef.get(ProjectService);

    await app.init();
  });

  beforeEach(async () => {
    await db.clearDb();
    auth = await userOrcha.signUp({ token: true }, '', creds);
    
    const { body: cm } = await axios.post('http://localhost:3335/change_maker/createProfile', {
      query: cmQuery,
      token: auth.body.token,
      dto: {
          handle: 'bobby',
          firstName: 'fn',
          lastName: 'ln',
          phone: '(555) 555-5555',
        }
    });
    cmProfile = cm;
    const sp = await createServePartner(spQuery, spRepo, { id: uuid.v4(), handle: 'spHandle' });
    await createServeAdmin({}, saRepo, creds.id, sp.id);
    const { body } = await axios.post('http://localhost:3335/project/create', {
      query: projectQuery,
      token: auth.body.token,
      dto: { spId: sp.id },
    });
    project = body;
  });

  afterAll(async () => await app.close());

  describe('get', () => {
    it('my enrollments should initially be zero', async () => {
      const { body } = await axios.post('http://localhost:3335/enrollment/get', {
        query: enrollmentQuery,
        token: auth.body.token,
      });
      expect(body.length).toBe(0);
    });

    it('should get enrollment after applying', async () => {
      await enrollmentOrcha.startApplication({}, auth.body.token, { projectId: project.id });
      const { body } = await axios.post('http://localhost:3335/enrollment/get', {
        query: enrollmentQuery,
        token: auth.body.token,
      });
      expect(body.length).toBe(1);
    });
  });

  describe('startApplication', () => {
    it('should start application', async () => {
      await projectRepo.update(project.id, { maxChangeMakers: 1 });
      const { body } = await axios.post('http://localhost:3335/enrollment/startApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            projectId: project.id,
          },
      });
      expect(await enrollmentRepo.findOneOrFail(body.id, enrollmentQuery)).toMatchObject({
        ...body,
        dateApplied: parseDate(body.dateApplied),
      });
      expect(calculateEnrollmentStatus(body)).toBe(EnrollmentStatus.started);
    });
    it('should not allow application if max # of enrollments reached', async () => {
      await projectRepo.update(project.id, { maxChangeMakers: 0 });
      const { error } = await axios.post('http://localhost:3335/enrollment/startApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            projectId: project.id,
          },
      });
      expect(error).toBe(`The maximum number of ChangeMakers allotted for this project has been reached.`);
    });
  });
  describe('withdraw', () => {
    it('should withdraw application', async () => {
      const { body } = await axios.post('http://localhost:3335/enrollment/startApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            projectId: project.id,
          },
      });
      const { body: res } = await axios.post('http://localhost:3335/enrollment/withdraw', {
        query: { deletedId: true },
        token: auth.body.token,
        dto: {
            enrollmentId: body.id,
          },
      });
      expect(res.deletedId).toBe(body.id);
      expect(await enrollmentRepo.findOne(body.id)).toBeFalsy();
    });
  });
  describe('linkPassportDocument', () => {
    it('should link passport document', async () => {
      const passportDocId = uuid.v4();
      await passportRepo.upsert({
        id: passportDocId,
        changeMaker: cmProfile.id,
        enrollmentDocuments: [],
        filePath: '',
        name: '',
        uploadedDate: new Date(),
      });
      const projectDocId = uuid.v4();
      await projectDocRepo.upsert({
        id: projectDocId,
        description: '',
        infoUrl: '',
        title: '',
        project: project.id,
        enrollmentDocuments: [],
      });
      const { body } = await axios.post('http://localhost:3335/enrollment/startApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            projectId: project.id,
          },
      });
      const { body: res } = await axios.post('http://localhost:3335/enrollment/linkPassportDocuments', {
        query: { enrollmentDocuments: { passportDocument: { id: true }, projectDocument: { id: true } } },
        token: auth.body.token,
        dto: { 
            enrollmentId: body.id, 
            passportDocumentId: passportDocId, 
            projectDocumentId: projectDocId 
          },
      });
      expect(res.enrollmentDocuments[0].passportDocument.id).toBe(passportDocId);
      expect(res.enrollmentDocuments[0].projectDocument.id).toBe(projectDocId);
    });
  });
  describe('submitApplication', () => {
    it('should not submit application if waiver is not accepted', async () => {
      const { body } = await axios.post('http://localhost:3335/enrollment/startApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            projectId: project.id,
          },
      });
      const { error } = await axios.post('http://localhost:3335/enrollment/submitApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            enrollmentId: body.id,
          },
      });
      expect(error).toBe(
        `You must accept the Project waiver${
          body.project.requireCustomWaiver ? 's' : ''
        } in order to submit your Enrollment Application.`
      );
    });
    it('should not submit application if application is already submitted', async () => {
      const { body } = await axios.post('http://localhost:3335/enrollment/startApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            projectId: project.id,
          },
      });
      await enrollmentRepo.update(body.id, { dateSubmitted: new Date(), acceptedWaiver: true });
      const { error } = await axios.post('http://localhost:3335/enrollment/submitApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            enrollmentId: body.id,
          },
      });
      expect(error).toBe('You have already submitted your application to this project.');
    });
    it('should not submit application if not all project documents have been linked', async () => {
      const { body } = await axios.post('http://localhost:3335/enrollment/startApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            projectId: project.id,
          },
      });
      await enrollmentRepo.update(body.id, { acceptedWaiver: true });
      await projectDocRepo.upsert({
        id: uuid.v4(),
        description: '',
        infoUrl: '',
        title: '',
        project: project.id,
        enrollmentDocuments: [],
      });
      const { error } = await axios.post('http://localhost:3335/enrollment/submitApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            enrollmentId: body.id,
          },
      });
      expect(error).toBe(
        'You have not linked all your passport documents to this project. Please finish the application to submit.'
      );
    });
    it('should submit application', async () => {
      const { body } = await axios.post('http://localhost:3335/enrollment/startApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            projectId: project.id,
          },
      });
      await enrollmentRepo.update(body.id, { acceptedWaiver: true });
      const { body: res } = await axios.post('http://localhost:3335/enrollment/submitApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            enrollmentId: body.id,
          },
      });
      expect(calculateEnrollmentStatus(res)).toBe(EnrollmentStatus.pending);
    });
  });
  describe('acceptWaiver', () => {
    it('should accept waiver', async () => {
      const { body } = await axios.post('http://localhost:3335/enrollment/startApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            projectId: project.id,
          },
      });
      expect(body.acceptedWaiver).toBe(false);
      const { body: res } = await axios.post('http://localhost:3335/enrollment/acceptWaiver', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            enrollmentId: body.id,
          },
      });
      expect(res.acceptedWaiver).toBe(true);
    });
  });
  describe('processEnrollmentApplication', () => {
    it(`should not process application if not in pending state`, async () => {
      const { body } = await axios.post('http://localhost:3335/enrollment/startApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            projectId: project.id,
          },
      });
      await enrollmentRepo.update(body.id, { acceptedWaiver: true });
      const status = calculateEnrollmentStatus(body);
      const approve = true;
      const { error } = await axios.post('http://localhost:3335/enrollment/processEnrollmentApplication', {
        query: {},
        token: auth.body.token,
        dto: {
            approve,
            enrollmentId: body.id,
          },
      });
      expect(error).toBe(
        `This enrollment must be in a pending state to be processed. Current state: "${status}".`
      );
    });
    it(`should not process application if trying to
       approve/deny their own application (cm is themselves)`, async () => {
      const { body } = await axios.post('http://localhost:3335/enrollment/startApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            projectId: project.id,
          },
      });
      await enrollmentRepo.update(body.id, { acceptedWaiver: true });
      await axios.post('http://localhost:3335/enrollment/submitApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            enrollmentId: body.id,
          },
      });
      const approve = true;
      const { error } = await axios.post('http://localhost:3335/enrollment/processEnrollmentApplication', {
        query: {},
        token: auth.body.token,
        dto: {
            approve,
            enrollmentId: body.id,
          },
      });
      expect(error).toBe(
        `Unauthorized to ${approve ? 'approve' : 'deny'} your own application.
        You must have another ServeAdmin ${approve ? 'approve' : 'deny'} your application.`.trim()
      );
    });
    it(`should approve application`, async () => {
      const { body } = await axios.post('http://localhost:3335/enrollment/startApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            projectId: project.id,
          },
      });
      await enrollmentRepo.update(body.id, { acceptedWaiver: true });
      await axios.post('http://localhost:3335/enrollment/submitApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            enrollmentId: body.id,
          },
      });
      projectService.permissions.userIsServeAdmin = jest.fn(async () => ({
        changeMaker: { id: 'noMatch' },
      })) as jest.Mock;
      const approve = true;
      const { body: res } = await axios.post('http://localhost:3335/enrollment/processEnrollmentApplication', {
        query: { dateApplied: true, dateApproved: true, dateDenied: true, dateRetired: true, dateSubmitted: true },
        token: auth.body.token,
        dto: { approve, enrollmentId: body.id },
      });
      expect(calculateEnrollmentStatus(res)).toBe(EnrollmentStatus.enrolled);
    });
    it(`should deny application`, async () => {
      const { body } = await axios.post('http://localhost:3335/enrollment/startApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
          projectId: project.id,
        }
      });
      await enrollmentRepo.update(body.id, { acceptedWaiver: true });
      await axios.post('http://localhost:3335/enrollment/submitApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            enrollmentId: body.id,
          },
      });
      projectService.permissions.userIsServeAdmin = jest.fn(async () => ({
        changeMaker: { id: 'noMatch' },
      })) as jest.Mock;
      const approve = false;
      const { body: res } = await axios.post('http://localhost:3335/enrollment/processEnrollmentApplication', {
        query: { dateApplied: true, dateApproved: true, dateDenied: true, dateRetired: true, dateSubmitted: true },
        token: auth.body.token,
        dto: { approve, enrollmentId: body.id },
      });
      expect(calculateEnrollmentStatus(res)).toBe(EnrollmentStatus.denied);
    });
  });
  describe('revert', () => {
    it('should revert enrollment', async () => {
      const { body } = await axios.post('http://localhost:3335/enrollment/startApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            projectId: project.id,
          },
      });
      await enrollmentRepo.update(body.id, { acceptedWaiver: true });
      await axios.post('http://localhost:3335/enrollment/submitApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            enrollmentId: body.id,
          },
      });
      projectService.permissions.userIsServeAdmin = jest.fn(async () => ({
        changeMaker: { id: 'noMatch' },
      })) as jest.Mock;
      const approve = true;
      const { body: res } = await axios.post('http://localhost:3335/enrollment/processEnrollmentApplication', {
        query: { dateApplied: true, dateApproved: true, dateDenied: true, dateRetired: true, dateSubmitted: true },
        token: auth.body.token,
        dto: {
            approve, 
            enrollmentId: body.id,
          },
      });
      expect(calculateEnrollmentStatus(res)).toBe(EnrollmentStatus.enrolled);
      const { body: revert } = await axios.post('http://localhost:3335/enrollment/revertEnrollmentApplication', {
        query: { dateApplied: true, dateApproved: true, dateDenied: true, dateRetired: true, dateSubmitted: true },
        token: auth.body.token,
        dto: {
            enrollmentId: body.id,
          },
      });
      expect(calculateEnrollmentStatus(revert)).toBe(EnrollmentStatus.pending);
    });
    it('should not revert enrollment if not approved or denied yet', async () => {
      const { body } = await axios.post('http://localhost:3335/enrollment/startApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            projectId: project.id,
          },
      });
      await enrollmentRepo.update(body.id, { acceptedWaiver: true });
      await axios.post('http://localhost:3335/enrollment/submitApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            enrollmentId: body.id,
          },
      });
      const { error } = await axios.post('http://localhost:3335/enrollment/revertEnrollmentApplication', {
        query: { dateApplied: true, dateApproved: true, dateDenied: true, dateRetired: true, dateSubmitted: true },
        token: auth.body.token,
        dto: {
            enrollmentId: body.id,
          },
      });
      expect(error).toBe(
        'Cannot revert ChangeMaker because their application has not yet been approved nor denied.'
      );
    });
  });
  describe('retire', () => {
    it('should not retire if not yet approved', async () => {
      const { body } = await axios.post('http://localhost:3335/enrollment/startApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            projectId: project.id,
          },
      });
      await enrollmentRepo.update(body.id, { acceptedWaiver: true });
      await axios.post('http://localhost:4204/enrollment/submitApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
          enrollmentId: body.id
        }
      });
      const { error } = await enrollmentOrcha.retireEnrollment({}, auth.body.token, {
        enrollmentId: body.id,
      });
      expect(error).toBe('Cannot deny ChangeMaker because their application has not yet been approved.');
    });
    it('should retire', async () => {
      const { body } = await axios.post('http://localhost:3335/enrollment/startApplication', {
        quert: enrollmentQuery,
        token: auth.body.token,
        dto: {
          projectId: project.id
        }
      });
      await enrollmentRepo.update(body.id, { acceptedWaiver: true });
      await axios.post('http://localhost:3335/enrollment/submitApplication', {
        query: enrollmentQuery,
        token: auth.body.token,
        dto: {
            enrollmentId: body.id,
          },
      });
      projectService.permissions.userIsServeAdmin = jest.fn(async () => ({
        changeMaker: { id: 'noMatch' },
      })) as jest.Mock;
      const approve = true;
      await axios.post('http://localhost:3335/enrollment/processEnrollmentApplication', {
        query: { dateApplied: true, dateApproved: true, dateDenied: true, dateRetired: true, dateSubmitted: true },
        token: auth.body.token,
        dto: {
            approve, 
            enrollmentId: body.id,
          },
      });
      const { body: res } = await axios.post('http://localhost:3335/enrollment/retireEnrollment', {
        query: { dateApplied: true, dateApproved: true, dateDenied: true, dateRetired: true, dateSubmitted: true },
        token: auth.body.token,
        dto: {
            enrollmentId: body.id,
          },
      });
      expect(calculateEnrollmentStatus(res)).toBe(EnrollmentStatus.retired);
    });
  });
});
