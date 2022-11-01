import { StorageService } from '@involvemint/server/core/application-services';
import {
  CreditRepository,
  EnrollmentRepository,
  PoiRepository,
  ProjectRepository,
  ServeAdminRepository,
  ServePartnerRepository,
} from '@involvemint/server/core/domain-services';
import {
  calculateEnrollmentStatus,
  calculatePoiStatus,
  ChangeMaker,
  Enrollment,
  EnrollmentStatus,
  IChangeMakerOrchestration,
  ImConfig,
  IPoiOrchestration,
  IProjectOrchestration,
  IUserOrchestration,
  Poi,
  PoiStatus,
  Project,
  ServePartner,
} from '@involvemint/shared/domain';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { createQuery, IParser } from '@orcha/common';
import { ITestOrchestration } from '@orcha/testing';
import * as uuid from 'uuid';
import { AppTestModule } from '../../core/app-test.module';
import { DatabaseService } from '../../core/database.service';
import { createChangeMakerOrchestration } from '../change-maker/change-maker.orchestration';
import { createProjectOrchestration } from '../project/project.orchestration';
import { createServePartner } from '../serve-partner/serve-partner.helpers';
import { createUserOrchestration } from '../user/user.orchestration';
import { createPoiOrchestration } from './poi.orchestration';

describe('User Orchestration Integration Tests', () => {
  let app: INestApplication;
  let db: DatabaseService;

  let poiOrcha: ITestOrchestration<IPoiOrchestration>;
  let projectOrcha: ITestOrchestration<IProjectOrchestration>;
  let cmOrcha: ITestOrchestration<IChangeMakerOrchestration>;
  let userOrcha: ITestOrchestration<IUserOrchestration>;

  let enrollmentRepo: EnrollmentRepository;
  let spRepo: ServePartnerRepository;
  let saRepo: ServeAdminRepository;
  let poiRepo: PoiRepository;
  let creditRepo: CreditRepository;
  let projectRepo: ProjectRepository;

  let storage: StorageService;

  const creds = { id: 'email@email.com', password: 'GoodPwd341' };
  let auth: { body: { token: string }; statusCode: HttpStatus };

  const spQuery = createQuery<ServePartner>()({ id: true });
  let sp: IParser<ServePartner, typeof spQuery>;

  const poiQuery = createQuery<Poi>()({
    id: true,
    dateApproved: true,
    dateCreated: true,
    dateDenied: true,
    dateStarted: true,
    dateStopped: true,
    dateSubmitted: true,
    pausedTimes: true,
    resumedTimes: true,
    enrollment: { project: { title: true } },
    latitude: true,
    longitude: true,
  });

  const enrollmentQuery = createQuery<Enrollment>()({
    id: true,
    acceptedWaiver: true,
    dateApplied: true,
    dateApproved: true,
    dateDenied: true,
    dateRetired: true,
    dateSubmitted: true,
  });
  let enrollment: IParser<Enrollment, typeof enrollmentQuery>;

  const cmQuery = createQuery<ChangeMaker>()({ id: true });

  const projectQuery = createQuery<Project>()({ id: true });
  let project: IParser<Project, typeof projectQuery>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppTestModule],
      providers: [DatabaseService],
    }).compile();

    app = moduleRef.createNestApplication();
    db = moduleRef.get(DatabaseService);

    poiOrcha = createPoiOrchestration(app);
    projectOrcha = createProjectOrchestration(app);
    cmOrcha = createChangeMakerOrchestration(app);
    userOrcha = createUserOrchestration(app);

    spRepo = moduleRef.get(ServePartnerRepository);
    enrollmentRepo = moduleRef.get(EnrollmentRepository);
    projectRepo = moduleRef.get(ProjectRepository);
    saRepo = moduleRef.get(ServeAdminRepository);
    poiRepo = moduleRef.get(PoiRepository);
    creditRepo = moduleRef.get(CreditRepository);

    storage = moduleRef.get(StorageService);

    // Don't do file uploads.
    jest.spyOn(storage, 'upload').mockImplementation(async () => undefined);

    await app.init();
  });

  afterAll(async () => await app.close());

  beforeEach(async () => {
    await db.clearDb();
    auth = await userOrcha.signUp({ token: true }, '', creds);

    sp = await createServePartner(spQuery, spRepo, { id: uuid.v4(), handle: 'spHandle' });

    await saRepo.upsert(
      {
        id: uuid.v4(),
        datePermitted: new Date(),
        servePartner: sp.id,
        superAdmin: true,
        user: creds.id,
      },
      {}
    );

    const { body } = await projectOrcha.create(projectQuery, auth.body.token, { spId: sp.id });
    project = body;

    const { body: cm } = await cmOrcha.createProfile(cmQuery, auth.body.token, {
      handle: 'bobby',
      firstName: 'fn',
      lastName: 'ln',
      phone: '(555) 555-5555',
    });

    enrollment = await enrollmentRepo.upsert(
      {
        id: uuid.v4(),
        acceptedWaiver: true,
        changeMaker: cm.id,
        dateApplied: new Date(),
        enrollmentDocuments: [],
        pois: [],
        project: project.id,
        dateApproved: new Date(),
      },
      enrollmentQuery
    );
  });
  describe('get', () => {
    it('should get zero pois on system init', async () => {
      const { body } = await poiOrcha.get(poiQuery, auth.body.token);
      expect(body.length).toBe(0);
    });
    it('should get pois', async () => {
      await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      const { body } = await poiOrcha.get(poiQuery, auth.body.token);
      expect(body.length).toBe(1);
    });
  });
  describe('create', () => {
    it('should not create if enrollment status is not enrolled', async () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      enrollment = await enrollmentRepo.update(enrollment.id, { dateApproved: null! }, enrollmentQuery);
      const status = calculateEnrollmentStatus(enrollment);
      expect(status).not.toBe(EnrollmentStatus.enrolled);
      const { error } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      expect(error).toBe(
        `You are not enrolled in this project.
        Proof of Impact creation denied.
        Current Enrollment Status: ${status}`
      );
    });
    it('should not create if waiver has not been signed', async () => {
      enrollment = await enrollmentRepo.update(
        enrollment.id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        { dateApproved: null!, acceptedWaiver: false },
        enrollmentQuery
      );
      expect(calculateEnrollmentStatus(enrollment)).not.toBe(EnrollmentStatus.enrolled);
      enrollment = await enrollmentRepo.update(enrollment.id, { dateApproved: new Date() }, enrollmentQuery);
      expect(calculateEnrollmentStatus(enrollment)).toBe(EnrollmentStatus.enrolled);
      const { error } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      expect(error).toBe(
        `You have not accepted the waiver for this Project.
        Please accept the Project's waiver to create a new Proof of Impact.`
      );
    });
    describe('not create preexisting', () => {
      it('should not create if preexisting created poi already exists', async () => {
        const { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, {
          enrollmentId: enrollment.id,
        });
        expect(calculatePoiStatus(poi)).toBe(PoiStatus.created);
        const { error } = await poiOrcha.create(poiQuery, auth.body.token, {
          enrollmentId: enrollment.id,
        });
        expect(error).toBe(
          `You have an unsubmitted Proof of Impact to the Project Enrollment:
        ${poi.enrollment.project.title}. Please submit or withdraw this Proof of Impact
        before creating a new one.`
        );
      });
      it('should not create if preexisting started poi already exists', async () => {
        const { body } = await poiOrcha.create(poiQuery, auth.body.token, {
          enrollmentId: enrollment.id,
        });
        const poi = await poiRepo.update(body.id, { dateStarted: new Date() }, poiQuery);
        expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);
        const { error } = await poiOrcha.create(poiQuery, auth.body.token, {
          enrollmentId: enrollment.id,
        });
        expect(error).toBe(
          `You have an unsubmitted Proof of Impact to the Project Enrollment:
        ${poi.enrollment.project.title}. Please submit or withdraw this Proof of Impact
        before creating a new one.`
        );
      });
      it('should not create if preexisting paused poi already exists', async () => {
        const { body } = await poiOrcha.create(poiQuery, auth.body.token, {
          enrollmentId: enrollment.id,
        });
        const poi = await poiRepo.update(
          body.id,
          { dateStarted: new Date(), pausedTimes: [new Date()] },
          poiQuery
        );
        expect(calculatePoiStatus(poi)).toBe(PoiStatus.paused);
        const { error } = await poiOrcha.create(poiQuery, auth.body.token, {
          enrollmentId: enrollment.id,
        });
        expect(error).toBe(
          `You have an unsubmitted Proof of Impact to the Project Enrollment:
        ${poi.enrollment.project.title}. Please submit or withdraw this Proof of Impact
        before creating a new one.`
        );
      });
      it('should not create if preexisting stopped poi already exists', async () => {
        const { body } = await poiOrcha.create(poiQuery, auth.body.token, {
          enrollmentId: enrollment.id,
        });
        const poi = await poiRepo.update(
          body.id,
          { dateStarted: new Date(), dateStopped: new Date() },
          poiQuery
        );
        expect(calculatePoiStatus(poi)).toBe(PoiStatus.stopped);
        const { error } = await poiOrcha.create(poiQuery, auth.body.token, {
          enrollmentId: enrollment.id,
        });
        expect(error).toBe(
          `You have an unsubmitted Proof of Impact to the Project Enrollment:
        ${poi.enrollment.project.title}. Please submit or withdraw this Proof of Impact
        before creating a new one.`
        );
      });
    });
    describe('create preexisting', () => {
      it('should create when no other pois exist', async () => {
        const { body } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
        expect(calculatePoiStatus(body)).toBe(PoiStatus.created);
      });
      it('should create when there is a preexisting submitted poi', async () => {
        let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
        poi = await poiRepo.update(poi.id, { dateSubmitted: new Date() }, poiQuery);
        expect(calculatePoiStatus(poi)).toBe(PoiStatus.submitted);
        const { body } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
        expect(calculatePoiStatus(body)).toBe(PoiStatus.created);
      });
      it('should create when there is a preexisting approved poi', async () => {
        let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
        poi = await poiRepo.update(poi.id, { dateApproved: new Date() }, poiQuery);
        expect(calculatePoiStatus(poi)).toBe(PoiStatus.approved);
        const { body } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
        expect(calculatePoiStatus(body)).toBe(PoiStatus.created);
      });
      it('should create when there is a preexisting denied poi', async () => {
        let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
        poi = await poiRepo.update(poi.id, { dateDenied: new Date() }, poiQuery);
        expect(calculatePoiStatus(poi)).toBe(PoiStatus.denied);
        const { body } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
        expect(calculatePoiStatus(body)).toBe(PoiStatus.created);
      });
    });
  });
  describe('start', () => {
    it('should not start if not in created state', async () => {
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { dateStarted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);
      const { error } = await poiOrcha.start(poiQuery, auth.body.token, { poiId: poi.id });
      expect(error).toBe('Cannot start a Proof of Impact that has already been started.');
    });
    it('should not start if location is required and no location given', async () => {
      await projectRepo.update(project.id, { requireLocation: true });
      const { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      const { error } = await poiOrcha.start(poiQuery, auth.body.token, { poiId: poi.id });
      expect(error).toBe('Your location is required for this Proof of Impact.');
    });
    it('should start if location is not required and no location given', async () => {
      await projectRepo.update(project.id, { requireLocation: false });
      const { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      const { body: res } = await poiOrcha.start(poiQuery, auth.body.token, { poiId: poi.id });
      expect(calculatePoiStatus(res)).toBe(PoiStatus.started);
    });
    it('should start if location is required and location given', async () => {
      await projectRepo.update(project.id, { requireLocation: false });
      const { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      const { body: res } = await poiOrcha.start(poiQuery, auth.body.token, {
        poiId: poi.id,
        latitude: 1,
        longitude: 2,
      });
      expect(calculatePoiStatus(res)).toBe(PoiStatus.started);
      expect(res.latitude).toBe(1);
      expect(res.longitude).toBe(2);
    });
  });
  describe('stop', () => {
    it('should stop if in started state', async () => {
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { dateStarted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);
      const { body: res } = await poiOrcha.stop(poiQuery, auth.body.token, { poiId: poi.id });
      expect(calculatePoiStatus(res)).toBe(PoiStatus.stopped);
    });
    it('should stop if in paused state', async () => {
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { dateStarted: new Date(), pausedTimes: [new Date()] }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.paused);
      const { body: res } = await poiOrcha.stop(poiQuery, auth.body.token, { poiId: poi.id });
      expect(calculatePoiStatus(res)).toBe(PoiStatus.stopped);
    });
    it('should not stop if in created state', async () => {
      const { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.created);
      const { error } = await poiOrcha.stop(poiQuery, auth.body.token, { poiId: poi.id });
      expect(error).toBe('Proof of Impact must be started or paused to stop.');
    });
  });
  describe('withdraw', () => {
    it('should withdraw if created', async () => {
      const { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.created);
      expect(await poiRepo.findOne(poi.id)).toBeTruthy();
      const { body: res } = await poiOrcha.withdraw({ deletedId: true }, auth.body.token, { poiId: poi.id });
      expect(res.deletedId).toBe(poi.id);
      expect(await poiRepo.findOne(poi.id)).toBeFalsy();
    });
    it('should withdraw if started', async () => {
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { dateStarted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);
      const { body: res } = await poiOrcha.withdraw({ deletedId: true }, auth.body.token, { poiId: poi.id });
      expect(res.deletedId).toBe(poi.id);
      expect(await poiRepo.findOne(poi.id)).toBeFalsy();
    });
    it('should withdraw if paused', async () => {
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { dateStarted: new Date(), pausedTimes: [new Date()] }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.paused);
      const { body: res } = await poiOrcha.withdraw({ deletedId: true }, auth.body.token, { poiId: poi.id });
      expect(res.deletedId).toBe(poi.id);
      expect(await poiRepo.findOne(poi.id)).toBeFalsy();
    });
    it('should withdraw if stopped', async () => {
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { dateStopped: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.stopped);
      const { body: res } = await poiOrcha.withdraw({ deletedId: true }, auth.body.token, { poiId: poi.id });
      expect(res.deletedId).toBe(poi.id);
      expect(await poiRepo.findOne(poi.id)).toBeFalsy();
    });
    it('should not withdraw if approved', async () => {
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { dateApproved: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.approved);
      const { error } = await poiOrcha.withdraw({ deletedId: true }, auth.body.token, { poiId: poi.id });
      expect(error).toBe('This Proof of Impact has already been approved. Withdrawal denied.');
    });
    it('should not withdraw if denied', async () => {
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { dateDenied: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.denied);
      const { error } = await poiOrcha.withdraw({ deletedId: true }, auth.body.token, { poiId: poi.id });
      expect(error).toBe('This Proof of Impact has already been denied. Withdrawal denied.');
    });
  });
  describe('pause', () => {
    it('should not pause if in created state', async () => {
      const { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.created);
      const { error } = await poiOrcha.pause({}, auth.body.token, { poiId: poi.id });
      expect(error).toBe('This Proof of Impact is not in a valid state to be paused.');
    });
    it('should pause if in started state', async () => {
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { dateStarted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);
      const { body } = await poiOrcha.pause(poiQuery, auth.body.token, { poiId: poi.id });
      expect(calculatePoiStatus(body)).toBe(PoiStatus.paused);
    });
  });
  describe('resume', () => {
    it('should not resume if in created state', async () => {
      const { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.created);
      const { error } = await poiOrcha.resume({}, auth.body.token, { poiId: poi.id });
      expect(error).toBe('This Proof of Impact is not in a valid state to be resumed.');
    });
    it('should resume if in paused state', async () => {
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { dateStarted: new Date(), pausedTimes: [new Date()] }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.paused);
      const { body } = await poiOrcha.resume(poiQuery, auth.body.token, { poiId: poi.id });
      expect(calculatePoiStatus(body)).toBe(PoiStatus.started);
    });
  });
  describe('submit', () => {
    it('should not submit if in created state', async () => {
      const { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.created);
      const { error } = await poiOrcha.submit({}, auth.body.token, { poiId: poi.id, answers: [] }, []);
      expect(error).toBe('This Proof of Impact is not in a valid state to be submitted.');
    });
    it('should submit if in started state', async () => {
      await projectRepo.update(project.id, { requireImages: false });
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { dateStarted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);
      const { body } = await poiOrcha.submit(poiQuery, auth.body.token, { poiId: poi.id, answers: [] }, []);
      expect(calculatePoiStatus(body)).toBe(PoiStatus.submitted);
    });
    it('should submit if in paused state', async () => {
      await projectRepo.update(project.id, { requireImages: false });
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { pausedTimes: [new Date()] }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.paused);
      const { body } = await poiOrcha.submit(poiQuery, auth.body.token, { poiId: poi.id, answers: [] }, []);
      expect(calculatePoiStatus(body)).toBe(PoiStatus.submitted);
    });
    it('should submit if in stopped state', async () => {
      await projectRepo.update(project.id, { requireImages: false });
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { dateStopped: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.stopped);
      const { body } = await poiOrcha.submit(poiQuery, auth.body.token, { poiId: poi.id, answers: [] }, []);
      expect(calculatePoiStatus(body)).toBe(PoiStatus.submitted);
    });
    it('should not submit if images are required and none are given', async () => {
      await projectRepo.update(project.id, { requireImages: true });
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { dateStarted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);
      const { error } = await poiOrcha.submit({}, auth.body.token, { poiId: poi.id, answers: [] }, []);
      expect(error).toBe('This Proof of Impact requires at least one image upon submission.');
    });
    it('should submit if images are required and at least one is given', async () => {
      await projectRepo.update(project.id, { requireImages: true });
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { dateStarted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);
      const { body } = await poiOrcha.submit(poiQuery, auth.body.token, { poiId: poi.id, answers: [] }, [
        new File([], 'file.txt'),
      ]);
      expect(calculatePoiStatus(body)).toBe(PoiStatus.submitted);
    });
    it('should not submit if questions are required and none is given', async () => {
      await projectRepo.update(project.id, {
        requireImages: false,
        questions: [{ id: uuid.v4(), answers: [], text: '' }],
      });
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { dateStarted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);
      const { error } = await poiOrcha.submit(poiQuery, auth.body.token, { poiId: poi.id, answers: [] }, []);
      expect(error).toBe(`This Proof of Impact requires the submission of answers to 1 questions.`);
    });
    it('should submit if questions are required and the correct amount is given', async () => {
      const qId = uuid.v4();
      await projectRepo.update(project.id, {
        requireImages: false,
        questions: [{ id: qId, answers: [], text: '' }],
      });
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { dateStarted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);
      const { body } = await poiOrcha.submit(
        poiQuery,
        auth.body.token,
        { poiId: poi.id, answers: [{ questionId: qId, answer: 'answer' }] },
        []
      );
      expect(calculatePoiStatus(body)).toBe(PoiStatus.submitted);
    });
  });
  describe('approve', () => {
    it('should not approve if in created state', async () => {
      const { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.created);
      const { error } = await poiOrcha.approve({}, auth.body.token, { poiId: poi.id });
      expect(error).toBe('This Proof of Impact must first be submitted to be approved.');
    });
    it('should not approve if in started state', async () => {
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { dateStarted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);
      const { error } = await poiOrcha.approve({}, auth.body.token, { poiId: poi.id });
      expect(error).toBe('This Proof of Impact must first be submitted to be approved.');
    });
    it('should not approve if in paused state', async () => {
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { pausedTimes: [new Date()] }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.paused);
      const { error } = await poiOrcha.approve({}, auth.body.token, { poiId: poi.id });
      expect(error).toBe('This Proof of Impact must first be submitted to be approved.');
    });
    it('should not approve if in resumed state', async () => {
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { pausedTimes: [new Date()], resumedTimes: [new Date()] }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);
      const { error } = await poiOrcha.approve({}, auth.body.token, { poiId: poi.id });
      expect(error).toBe('This Proof of Impact must first be submitted to be approved.');
    });
    it('should not approve if in stopped state', async () => {
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { dateStopped: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.stopped);
      const { error } = await poiOrcha.approve({}, auth.body.token, { poiId: poi.id });
      expect(error).toBe('This Proof of Impact must first be submitted to be approved.');
    });
    it('should not approve if in denied state', async () => {
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { dateDenied: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.denied);
      const { error } = await poiOrcha.approve({}, auth.body.token, { poiId: poi.id });
      expect(error).toBe('This Proof of Impact must first be submitted to be approved.');
    });
    it('should approve if in submitted state', async () => {
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(
        poi.id,
        { dateSubmitted: new Date(), dateStarted: new Date(), dateStopped: new Date() },
        poiQuery
      );
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.submitted);
      const { body } = await poiOrcha.approve(poiQuery, auth.body.token, { poiId: poi.id });
      expect(calculatePoiStatus(body)).toBe(PoiStatus.approved);
    });
    it('should create if in submitted state with correct amount of credits', async () => {
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(
        poi.id,
        {
          dateSubmitted: new Date(),
          dateStarted: new Date(2020, 0, 0, 0, 0, 0),
          dateStopped: new Date(2020, 0, 0, 0, 0, 3600 / 6),
        },
        poiQuery
      );
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.submitted);
      const { body } = await poiOrcha.approve(poiQuery, auth.body.token, { poiId: poi.id });
      expect(calculatePoiStatus(body)).toBe(PoiStatus.approved);
      const credits = await creditRepo.findAll();
      expect(credits[0].amount).toBe(ImConfig.creditsPerHour / 6);
    });
  });
  describe('deny', () => {
    it('should not deny if in created state', async () => {
      const { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.created);
      const { error } = await poiOrcha.deny({}, auth.body.token, { poiId: poi.id });
      expect(error).toBe('This Proof of Impact must first be submitted to be denied.');
    });
    it('should not deny if in started state', async () => {
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { dateStarted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);
      const { error } = await poiOrcha.deny({}, auth.body.token, { poiId: poi.id });
      expect(error).toBe('This Proof of Impact must first be submitted to be denied.');
    });
    it('should not deny if in paused state', async () => {
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { pausedTimes: [new Date()] }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.paused);
      const { error } = await poiOrcha.deny({}, auth.body.token, { poiId: poi.id });
      expect(error).toBe('This Proof of Impact must first be submitted to be denied.');
    });
    it('should not deny if in resumed state', async () => {
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { pausedTimes: [new Date()], resumedTimes: [new Date()] }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);
      const { error } = await poiOrcha.deny({}, auth.body.token, { poiId: poi.id });
      expect(error).toBe('This Proof of Impact must first be submitted to be denied.');
    });
    it('should not deny if in stopped state', async () => {
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { dateStopped: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.stopped);
      const { error } = await poiOrcha.deny({}, auth.body.token, { poiId: poi.id });
      expect(error).toBe('This Proof of Impact must first be submitted to be denied.');
    });
    it('should not deny if in denied state', async () => {
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { dateDenied: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.denied);
      const { error } = await poiOrcha.deny({}, auth.body.token, { poiId: poi.id });
      expect(error).toBe('This Proof of Impact must first be submitted to be denied.');
    });

    it('should deny if in submitted state', async () => {
      let { body: poi } = await poiOrcha.create(poiQuery, auth.body.token, { enrollmentId: enrollment.id });
      poi = await poiRepo.update(poi.id, { dateSubmitted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.submitted);
      const { body } = await poiOrcha.deny(poiQuery, auth.body.token, { poiId: poi.id });
      expect(calculatePoiStatus(body)).toBe(PoiStatus.denied);
    });
  });
});
