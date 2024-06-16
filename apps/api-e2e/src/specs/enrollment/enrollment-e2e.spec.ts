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
  createQuery,
  DTO_KEY,
  Enrollment,
  EnrollmentStatus,
  IParser,
  Project,
  QUERY_KEY,
  ServePartner,
  TOKEN_KEY,
} from '@involvemint/shared/domain';
import { parseDate } from '@involvemint/shared/util';
import { HttpStatus } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import * as uuid from 'uuid';
import { AppTestModule } from '../../core/app-test.module';
import { DatabaseService } from '../../core/database.service';
import { createServeAdmin } from '../serve-admin/serve-admin.helpers';
import { createServePartner } from '../serve-partner/serve-partner.helpers';
import supertest from 'supertest';

describe('Enrollment Integration Tests', () => {
  let app: NestFastifyApplication;
  let db: DatabaseService;

  let enrollmentRepo: EnrollmentRepository;
  let spRepo: ServePartnerRepository;
  let projectRepo: ProjectRepository;
  let saRepo: ServeAdminRepository;
  let passportRepo: PassportDocumentRepository;
  let projectDocRepo: ProjectDocumentRepository;

  let projectService: ProjectService;

  const creds = { id: 'email@email.com', password: 'GoodPwd@341' };
  let token: string;

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
    const signUpResult = await supertest(app.getHttpServer())
      .post('/user/signUp')
      .send({
        query: { [TOKEN_KEY]: true },
        dto: creds,
      });
    token = signUpResult.body[TOKEN_KEY];
    const profileCreationResult = await supertest(app.getHttpServer())
      .post('/changeMaker/createProfile')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: cmQuery,
        [DTO_KEY]: {
          handle: 'bobby',
          firstName: 'fn',
          lastName: 'ln',
          phone: '(555) 555-5555',
        }
      });
    
    cmProfile = profileCreationResult.body as IParser<ChangeMaker, typeof cmQuery>;
    expect(profileCreationResult.statusCode).toBe(HttpStatus.CREATED);

    const sp = await createServePartner(spQuery, spRepo, { id: uuid.v4(), handle: 'spHandle' });
    await createServeAdmin({}, saRepo, creds.id, sp.id);

    const projectCreationResult = await supertest(app.getHttpServer())
    .post('/project/create')
    .set('token', token)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send({ 
      [QUERY_KEY]: projectQuery,
      [DTO_KEY]: { spId: sp.id }
    });

    project = projectCreationResult.body;
  });

  afterAll(async () => await app.close());

  describe('get', () => {
    it('my enrollments should initially be zero', async () => {
      const getEnrollmentResult = await supertest(app.getHttpServer())
      .post('/enrollment/get')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery
      });
      
      expect(getEnrollmentResult.body.length).toBe(0);
    });

    it('should get enrollment after applying', async () => {
      await supertest(app.getHttpServer())
      .post('/enrollment/startApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: { projectId: project.id }
      });

      const getEnrollmentResult = await supertest(app.getHttpServer())
      .post('/enrollment/get')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery
      });
      
      expect(getEnrollmentResult.body.length).toBe(1);
    });
  });

  describe('startApplication', () => {
    it('should start application', async () => {
      await projectRepo.update(project.id, { maxChangeMakers: 1 });
      
      const startApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/startApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: { projectId: project.id }
      });

      expect(await enrollmentRepo.findOneOrFail(startApplicationResult.body.id, enrollmentQuery)).toMatchObject({
        ...startApplicationResult.body,
        dateApplied: parseDate(startApplicationResult.body.dateApplied),
      });
      expect(calculateEnrollmentStatus(startApplicationResult.body)).toBe(EnrollmentStatus.started);
    });
    it('should not allow application if max # of enrollments reached', async () => {
      await projectRepo.update(project.id, { maxChangeMakers: 0 });
      const startApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/startApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: { projectId: project.id }
      });

      const error = startApplicationResult.error;

      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe(`The maximum number of ChangeMakers allotted for this project has been reached.`);
      }
    });
  });
  describe('withdraw', () => {
    it('should withdraw application', async () => {
      const startApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/startApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: { projectId: project.id }
      });

      const withdrawApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/withdraw')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: { deletedId: true },
        [DTO_KEY]: {
          enrollmentId: startApplicationResult.body.id,
        }
      });

      expect(withdrawApplicationResult.body.deletedId).toBe(startApplicationResult.body.id);
      expect(await enrollmentRepo.findOne(startApplicationResult.body.id)).toBeFalsy();
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
      
      const startApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/startApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: { projectId: project.id }
      });

      const linkPassportDocResult = await supertest(app.getHttpServer())
      .post('/enrollment/linkPassportDocument')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: { enrollmentDocuments: { passportDocument: { id: true }, projectDocument: { id: true } } },
        [DTO_KEY]: { enrollmentId: startApplicationResult.body.id, passportDocumentId: passportDocId, projectDocumentId: projectDocId }
      });

      expect(linkPassportDocResult.body.enrollmentDocuments[0].passportDocument.id).toBe(passportDocId);
      expect(linkPassportDocResult.body.enrollmentDocuments[0].projectDocument.id).toBe(projectDocId);
    });
  });
  describe('submitApplication', () => {
    it('should not submit application if waiver is not accepted', async () => {
      const startApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/startApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: { projectId: project.id }
      });

      const submitApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/submitApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: { enrollmentId: startApplicationResult.body.id }
      });

      const error = submitApplicationResult.error;

      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe(
          `You must accept the Project waiver${
            startApplicationResult.body.project.requireCustomWaiver ? 's' : ''
          } in order to submit your Enrollment Application.`
        );
      }
      
    });
    it('should not submit application if application is already submitted', async () => {
      const startApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/startApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: { projectId: project.id }
      });

      await enrollmentRepo.update(startApplicationResult.body.id, { dateSubmitted: new Date(), acceptedWaiver: true });

      const submitApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/submitApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: { enrollmentId: startApplicationResult.body.id }
      });

      const error = submitApplicationResult.error;

      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe('You have already submitted your application to this project.');
      }
    });
    it('should not submit application if not all project documents have been linked', async () => {
      const startApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/startApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: { projectId: project.id }
      });

      await enrollmentRepo.update(startApplicationResult.body.id, { acceptedWaiver: true });
      await projectDocRepo.upsert({
        id: uuid.v4(),
        description: '',
        infoUrl: '',
        title: '',
        project: project.id,
        enrollmentDocuments: [],
      });

      const submitApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/submitApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: { enrollmentId: startApplicationResult.body.id }
      });

      const error = submitApplicationResult.error;

      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe('You have not linked all your passport documents to this project. Please finish the application to submit.');
      }
    });
    it('should submit application', async () => {
      const startApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/startApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: { projectId: project.id }
      });

      await enrollmentRepo.update(startApplicationResult.body.id, { acceptedWaiver: true });

      const submitApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/submitApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: { enrollmentId: startApplicationResult.body.id }
      });

      expect(calculateEnrollmentStatus(submitApplicationResult.body)).toBe(EnrollmentStatus.pending);
    });
  });
  describe('acceptWaiver', () => {
    it('should accept waiver', async () => {
      const startApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/startApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: { projectId: project.id }
      });

      expect(startApplicationResult.body.acceptedWaiver).toBe(false);

      const acceptWaiverResult = await supertest(app.getHttpServer())
      .post('/enrollment/acceptWaiver')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: {
          enrollmentId: startApplicationResult.body.id,
        }
      });

      expect(acceptWaiverResult.body.acceptedWaiver).toBe(true);
    });
  });
  describe('processEnrollmentApplication', () => {
    it(`should not process application if not in pending state`, async () => {
      const startApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/startApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: { projectId: project.id }
      });

      await enrollmentRepo.update(startApplicationResult.body.id, { acceptedWaiver: true });
      const status = calculateEnrollmentStatus(startApplicationResult.body);
      const approve = true;

      const processEnrollmentApplication = await supertest(app.getHttpServer())
      .post('/enrollment/processEnrollmentApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: { dateApplied: true, dateApproved: true, dateDenied: true, dateRetired: true, dateSubmitted: true },
        [DTO_KEY]: {
          approve,
          enrollmentId: startApplicationResult.body.id,
        }
      });

      const error = processEnrollmentApplication.error;

      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe(
          `This enrollment must be in a pending state to be processed. Current state: "${status}".`
        );
      }
    });
    it(`should not process application if trying to
       approve/deny their own application (cm is themselves)`, async () => {
        const startApplicationResult = await supertest(app.getHttpServer())
        .post('/enrollment/startApplication')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: enrollmentQuery,
          [DTO_KEY]: { projectId: project.id }
        });

      await enrollmentRepo.update(startApplicationResult.body.id, { acceptedWaiver: true });

      await supertest(app.getHttpServer())
        .post('/enrollment/submitApplication')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: enrollmentQuery,
          [DTO_KEY]: {
            enrollmentId: startApplicationResult.body.id,
          }
        });

      const approve = true;

      const processApplicationResult = await supertest(app.getHttpServer())
        .post('/enrollment/processEnrollmentApplication')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: { dateApplied: true, dateApproved: true, dateDenied: true, dateRetired: true, dateSubmitted: true },
          [DTO_KEY]: {
            approve,
            enrollmentId: startApplicationResult.body.id,
          }
        });
      
      const error = processApplicationResult.error;

      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe(
          `Unauthorized to ${approve ? 'approve' : 'deny'} your own application.
        You must have another ServeAdmin ${approve ? 'approve' : 'deny'} your application.`.trim()
        );
      }
      
    });
    it(`should approve application`, async () => {
      const startApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/startApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: { projectId: project.id }
      });
      
      await enrollmentRepo.update(startApplicationResult.body.id, { acceptedWaiver: true });

      await supertest(app.getHttpServer())
      .post('/enrollment/submitApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: {
          enrollmentId: startApplicationResult.body.id,
        }
      });
      projectService.permissions.userIsServeAdmin = jest.fn(async () => ({
        changeMaker: { id: 'noMatch' },
      })) as jest.Mock;
      const approve = true;

      const processApplicationResult = await supertest(app.getHttpServer())
        .post('/enrollment/processEnrollmentApplication')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: { dateApplied: true, dateApproved: true, dateDenied: true, dateRetired: true, dateSubmitted: true },
          [DTO_KEY]: {
            approve,
            enrollmentId: startApplicationResult.body.id,
          }
        });
      expect(calculateEnrollmentStatus(processApplicationResult.body)).toBe(EnrollmentStatus.enrolled);
    });
    it(`should deny application`, async () => {
      const startApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/startApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: { projectId: project.id }
      });

      await enrollmentRepo.update(startApplicationResult.body.id, { acceptedWaiver: true });

      await supertest(app.getHttpServer())
      .post('/enrollment/submitApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: {
          enrollmentId: startApplicationResult.body.id,
        }
      });

      projectService.permissions.userIsServeAdmin = jest.fn(async () => ({
        changeMaker: { id: 'noMatch' },
      })) as jest.Mock;
      const approve = false;

      const processApplicationResult = await supertest(app.getHttpServer())
        .post('/enrollment/processEnrollmentApplication')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: { dateApplied: true, dateApproved: true, dateDenied: true, dateRetired: true, dateSubmitted: true },
          [DTO_KEY]: {
            approve,
            enrollmentId: startApplicationResult.body.id,
          }
        });
      expect(calculateEnrollmentStatus(processApplicationResult.body)).toBe(EnrollmentStatus.denied);
    });
  });
  describe('revert', () => {
    it('should revert enrollment', async () => {
      const startApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/startApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: { projectId: project.id }
      });

      await enrollmentRepo.update(startApplicationResult.body.id, { acceptedWaiver: true });

      await supertest(app.getHttpServer())
      .post('/enrollment/submitApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: {
          enrollmentId: startApplicationResult.body.id,
        }
      });

      projectService.permissions.userIsServeAdmin = jest.fn(async () => ({
        changeMaker: { id: 'noMatch' },
      })) as jest.Mock;

      const approve = true;

      const processApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/processEnrollmentApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: { dateApplied: true, dateApproved: true, dateDenied: true, dateRetired: true, dateSubmitted: true },
        [DTO_KEY]: {
          approve,
          enrollmentId: startApplicationResult.body.id,
        }
      });

      expect(calculateEnrollmentStatus(processApplicationResult.body)).toBe(EnrollmentStatus.enrolled);

      const revertApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/revertEnrollmentApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: { dateApplied: true, dateApproved: true, dateDenied: true, dateRetired: true, dateSubmitted: true },
        [DTO_KEY]: {
          enrollmentId: startApplicationResult.body.id,
        }
      });

      expect(calculateEnrollmentStatus(revertApplicationResult.body)).toBe(EnrollmentStatus.pending);
    });
    it('should not revert enrollment if not approved or denied yet', async () => {
      const startApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/startApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: { projectId: project.id }
      });

      await enrollmentRepo.update(startApplicationResult.body.id, { acceptedWaiver: true });

      await supertest(app.getHttpServer())
      .post('/enrollment/submitApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: {
          enrollmentId: startApplicationResult.body.id,
        }
      });

      const revertApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/revertEnrollmentApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: { dateApplied: true, dateApproved: true, dateDenied: true, dateRetired: true, dateSubmitted: true },
        [DTO_KEY]: {
          enrollmentId: startApplicationResult.body.id,
        }
      });

      const error = revertApplicationResult.error;

      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe(
          'Cannot revert ChangeMaker because their application has not yet been approved nor denied.'
        );
      }
    });
  });
  describe('retire', () => {
    it('should not retire if not yet approved', async () => {
      const startApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/startApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: { projectId: project.id }
      });

      await enrollmentRepo.update(startApplicationResult.body.id, { acceptedWaiver: true });

      await supertest(app.getHttpServer())
      .post('/enrollment/submitApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: {
          enrollmentId: startApplicationResult.body.id,
        }
      });

      const retireApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/retireEnrollment')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: {},
        [DTO_KEY]: { enrollmentId: startApplicationResult.body.id, }
      });

      const error = retireApplicationResult.error;

      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe('Cannot deny ChangeMaker because their application has not yet been approved.');
      }
    });
    it('should retire', async () => {
      const startApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/startApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: { projectId: project.id }
      });

      await enrollmentRepo.update(startApplicationResult.body.id, { acceptedWaiver: true });

      await supertest(app.getHttpServer())
      .post('/enrollment/submitApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: enrollmentQuery,
        [DTO_KEY]: {
          enrollmentId: startApplicationResult.body.id,
        }
      });

      projectService.permissions.userIsServeAdmin = jest.fn(async () => ({
        changeMaker: { id: 'noMatch' },
      })) as jest.Mock;
      const approve = true;

      await supertest(app.getHttpServer())
      .post('/enrollment/processEnrollmentApplication')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: { dateApplied: true, dateApproved: true, dateDenied: true, dateRetired: true, dateSubmitted: true },
        [DTO_KEY]: {
          approve,
          enrollmentId: startApplicationResult.body.id,
        }
      });
      
      const retireApplicationResult = await supertest(app.getHttpServer())
      .post('/enrollment/retireEnrollment')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: { dateApplied: true, dateApproved: true, dateDenied: true, dateRetired: true, dateSubmitted: true },
        [DTO_KEY]: { enrollmentId: startApplicationResult.body.id, }
      });

      expect(calculateEnrollmentStatus(retireApplicationResult.body)).toBe(EnrollmentStatus.retired);
    });
  });
});
