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
  createQuery,
  DTO_KEY,
  Enrollment,
  EnrollmentStatus,
  FILES_KEY,
  ImConfig,
  IParser,
  Poi,
  PoiStatus,
  Project,
  QUERY_KEY,
  ServePartner,
  TOKEN_KEY,
} from '@involvemint/shared/domain';
import { INestApplication, Query } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as uuid from 'uuid';
import { AppTestModule } from '../../core/app-test.module';
import { DatabaseService } from '../../core/database.service';
import { createServePartner } from '../serve-partner/serve-partner.helpers';
import supertest from 'supertest';
import { createServeAdmin } from '../serve-admin/serve-admin.helpers';

describe('POI Integration Tests', () => {
  let app: INestApplication;
  let db: DatabaseService;

  let enrollmentRepo: EnrollmentRepository;
  let spRepo: ServePartnerRepository;
  let saRepo: ServeAdminRepository;
  let poiRepo: PoiRepository;
  let creditRepo: CreditRepository;
  let projectRepo: ProjectRepository;

  let storage: StorageService;

  const creds = { id: 'email@email.com', password: 'GoodPwd@341' };
  let token: string;
  const poiApproverOrDenierCreds = { id: 'email2@email.com', password: 'GoodPwd@341' };
  let poiApproverOrDenyer: string;

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

    const userSignUpResult = await supertest(app.getHttpServer())
      .post('/user/signUp')
      .send({
        [QUERY_KEY]: { [TOKEN_KEY]: true },
        [DTO_KEY]: creds,
      });
    token = userSignUpResult.body[TOKEN_KEY];

    const poiApproverOrDenierSignUpResult = await supertest(app.getHttpServer())
    .post('/user/signUp')
    .send({
      [QUERY_KEY]: { [TOKEN_KEY]: true },
      [DTO_KEY]: poiApproverOrDenierCreds,
    });
    poiApproverOrDenyer = poiApproverOrDenierSignUpResult.body[TOKEN_KEY];
    
    sp = await createServePartner(spQuery, spRepo, { id: uuid.v4(), handle: 'spHandle' });

    await createServeAdmin({}, saRepo, creds.id, sp.id);

    await createServeAdmin({}, saRepo, poiApproverOrDenierCreds.id, sp.id);

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
    
    const cmProfile = profileCreationResult.body as IParser<ChangeMaker, typeof cmQuery>;

    enrollment = await enrollmentRepo.upsert(
      {
        id: uuid.v4(),
        acceptedWaiver: true,
        changeMaker: cmProfile.id,
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
      const poiGetResult = await supertest(app.getHttpServer())
      .post('/poi/get')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: poiQuery
      });
      expect(poiGetResult.body.length).toBe(0);
    });
    it('should get pois', async () => {
      await supertest(app.getHttpServer())
      .post('/poi/create')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: poiQuery,
        [DTO_KEY]: { enrollmentId: enrollment.id }
      });

      const poiGetResult = await supertest(app.getHttpServer())
      .post('/poi/get')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: poiQuery
      });
      expect(poiGetResult.body.length).toBe(1);
    });
  });
  describe('create', () => {
    it('should not create if enrollment status is not enrolled', async () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      enrollment = await enrollmentRepo.update(enrollment.id, { dateApproved: null! }, enrollmentQuery);
      const status = calculateEnrollmentStatus(enrollment);
      expect(status).not.toBe(EnrollmentStatus.enrolled);

      const poiCreateResult = await supertest(app.getHttpServer())
      .post('/poi/create')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: poiQuery,
        [DTO_KEY]: { enrollmentId: enrollment.id }
      });

      const error = poiCreateResult.error;

      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe(
          `You are not enrolled in this project.
        Proof of Impact creation denied.
        Current Enrollment Status: ${status}`
        );
      }
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

      const poiCreateResult = await supertest(app.getHttpServer())
      .post('/poi/create')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: poiQuery,
        [DTO_KEY]: { enrollmentId: enrollment.id }
      });

      const error = poiCreateResult.error;

      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe(
          `You have not accepted the waiver for this Project.
        Please accept the Project's waiver to create a new Proof of Impact.`
        );
      }
    });
    describe('not create preexisting', () => {
      it('should not create if preexisting created poi already exists', async () => {
        const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
        expect(calculatePoiStatus(poiCreateResult.body)).toBe(PoiStatus.created);
        const tempCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });

        const responseText =JSON.parse(tempCreateResult.text)['response']['text'];

        expect(responseText).toBe('You have an unsubmitted Proof of Impact to the Project Enrollment:\n' +
        `            ${poiCreateResult.body.enrollment.project.title}. Please submit or withdraw this Proof of Impact\n` +
        '            before creating a new one.');

      });
      it('should not create if preexisting started poi already exists', async () => {
        const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });

        const poi = await poiRepo.update(poiCreateResult.body.id, { dateStarted: new Date() }, poiQuery);
        expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);
        
        const poiCreateResult2 = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });

        const responseText =JSON.parse(poiCreateResult2.text)['response']['text'];

        expect(responseText).toBe('You have an unsubmitted Proof of Impact to the Project Enrollment:\n' +
        `            ${poi.enrollment.project.title}. Please submit or withdraw this Proof of Impact\n` +
        '            before creating a new one.');
      });
      it('should not create if preexisting paused poi already exists', async () => {
        const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });

        const poi = await poiRepo.update(
          poiCreateResult.body.id,
          { dateStarted: new Date(), pausedTimes: [new Date()] },
          poiQuery
        );
        expect(calculatePoiStatus(poi)).toBe(PoiStatus.paused);

        const poiCreateResult2 = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });

        const responseText =JSON.parse(poiCreateResult2.text)['response']['text'];

        expect(responseText).toBe('You have an unsubmitted Proof of Impact to the Project Enrollment:\n' +
        `            ${poi.enrollment.project.title}. Please submit or withdraw this Proof of Impact\n` +
        '            before creating a new one.');
      });
      it('should not create if preexisting stopped poi already exists', async () => {
        const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
        const poi = await poiRepo.update(
          poiCreateResult.body.id,
          { dateStarted: new Date(), dateStopped: new Date() },
          poiQuery
        );
        expect(calculatePoiStatus(poi)).toBe(PoiStatus.stopped);

        const poiCreateResult2 = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });

        const responseText =JSON.parse(poiCreateResult2.text)['response']['text'];

        expect(responseText).toBe('You have an unsubmitted Proof of Impact to the Project Enrollment:\n' +
        `            ${poi.enrollment.project.title}. Please submit or withdraw this Proof of Impact\n` +
        '            before creating a new one.');
      });
    });
    describe('create preexisting', () => {
      it('should create when no other pois exist', async () => {
        const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });

        expect(calculatePoiStatus(poiCreateResult.body)).toBe(PoiStatus.created);
      });
      it('should create when there is a preexisting submitted poi', async () => {
        const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });

        const poi = await poiRepo.update(poiCreateResult.body.id, { dateSubmitted: new Date() }, poiQuery);
        expect(calculatePoiStatus(poi)).toBe(PoiStatus.submitted);

        const poiCreateResult2 = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
        expect(calculatePoiStatus(poiCreateResult2.body)).toBe(PoiStatus.created);
      });
      it('should create when there is a preexisting approved poi', async () => {
        const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
        const poi = await poiRepo.update(poiCreateResult.body.id, { dateApproved: new Date() }, poiQuery);
        expect(calculatePoiStatus(poi)).toBe(PoiStatus.approved);
        
        const poiCreateResult2 = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
        expect(calculatePoiStatus(poiCreateResult2.body)).toBe(PoiStatus.created);
      });
      it('should create when there is a preexisting denied poi', async () => {
        const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
        const poi = await poiRepo.update(poiCreateResult.body.id, { dateDenied: new Date() }, poiQuery);
        expect(calculatePoiStatus(poi)).toBe(PoiStatus.denied);

        const poiCreateResult2 = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });        
        
        expect(calculatePoiStatus(poiCreateResult2.body)).toBe(PoiStatus.created);
      });
    });
  });
  describe('start', () => {
    it('should not start if not in created state', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { dateStarted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);

      const poiStartResult = await supertest(app.getHttpServer())
      .post('/poi/start')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: poiQuery,
        [DTO_KEY]: { poiId: poiCreateResult.body.id }
      });

      const error = poiStartResult.error;

      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe('Cannot start a Proof of Impact that has already been started.');
      }
    });
    it('should not start if location is required and no location given', async () => {
      await projectRepo.update(project.id, { requireLocation: true });
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      
        const poiStartResult = await supertest(app.getHttpServer())
        .post('/poi/start')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { poiId: poiCreateResult.body.id }
        });
  
        const error = poiStartResult.error;
  
        if(error !== false)
        {
          expect(JSON.parse(error.text).message).toBe('Your location is required for this Proof of Impact.');
        }
    });
    it('should start if location is not required and no location given', async () => {
      await projectRepo.update(project.id, { requireLocation: false });
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      
        const poiStartResult = await supertest(app.getHttpServer())
        .post('/poi/start')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { poiId: poiCreateResult.body.id }
        });
      expect(calculatePoiStatus(poiStartResult.body)).toBe(PoiStatus.started);
    });
    it('should start if location is required and location given', async () => {
      await projectRepo.update(project.id, { requireLocation: false });
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
        const poiStartResult = await supertest(app.getHttpServer())
        .post('/poi/start')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: {
            poiId: poiCreateResult.body.id,
            latitude: 1,
            longitude: 2,
          }
        });
      expect(calculatePoiStatus(poiStartResult.body)).toBe(PoiStatus.started);
      expect(poiStartResult.body.latitude).toBe(1);
      expect(poiStartResult.body.longitude).toBe(2);
    });
  });
  describe('stop', () => {
    it('should stop if in started state', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { dateStarted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);

      const poiStopResult = await supertest(app.getHttpServer())
        .post('/poi/stop')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { poiId: poiCreateResult.body.id }
        });
      expect(calculatePoiStatus(poiStopResult.body)).toBe(PoiStatus.stopped);
    });
    it('should stop if in paused state', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { dateStarted: new Date(), pausedTimes: [new Date()] }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.paused);
      
      const poiStopResult = await supertest(app.getHttpServer())
        .post('/poi/stop')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { poiId: poiCreateResult.body.id }
        });
      expect(calculatePoiStatus(poiStopResult.body)).toBe(PoiStatus.stopped);
    });
    it('should not stop if in created state', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      expect(calculatePoiStatus(poiCreateResult.body)).toBe(PoiStatus.created);
      
      const poiStopResult = await supertest(app.getHttpServer())
        .post('/poi/stop')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { poiId: poiCreateResult.body.id }
        });
      
      const error = poiStopResult.error;

      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe('Proof of Impact must be started or paused to stop.');
      }
    });
  });
  describe('withdraw', () => {
    it('should withdraw if created', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      expect(calculatePoiStatus(poiCreateResult.body)).toBe(PoiStatus.created);
      expect(await poiRepo.findOne(poiCreateResult.body.id)).toBeTruthy();

      const poiWithdrawResult = await supertest(app.getHttpServer())
      .post('/poi/withdraw')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: { deletedId: true },
        [DTO_KEY]: { poiId: poiCreateResult.body.id }
      });

      expect(poiWithdrawResult.body.deletedId).toBe(poiCreateResult.body.id);
      expect(await poiRepo.findOne(poiCreateResult.body.id)).toBeFalsy();
    });
    it('should withdraw if started', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { dateStarted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);

      const poiWithdrawResult = await supertest(app.getHttpServer())
      .post('/poi/withdraw')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: { deletedId: true },
        [DTO_KEY]: { poiId: poiCreateResult.body.id }
      });

      expect(poiWithdrawResult.body.deletedId).toBe(poi.id);
      expect(await poiRepo.findOne(poi.id)).toBeFalsy();
    });
    it('should withdraw if paused', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { dateStarted: new Date(), pausedTimes: [new Date()] }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.paused);
      
      const poiWithdrawResult = await supertest(app.getHttpServer())
      .post('/poi/withdraw')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: { deletedId: true },
        [DTO_KEY]: { poiId: poiCreateResult.body.id }
      });

      expect(poiWithdrawResult.body.deletedId).toBe(poi.id);
      expect(await poiRepo.findOne(poi.id)).toBeFalsy();
    });
    it('should withdraw if stopped', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { dateStopped: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.stopped);
      
      const poiWithdrawResult = await supertest(app.getHttpServer())
      .post('/poi/withdraw')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: { deletedId: true },
        [DTO_KEY]: { poiId: poiCreateResult.body.id }
      });

      expect(poiWithdrawResult.body.deletedId).toBe(poi.id);
      expect(await poiRepo.findOne(poi.id)).toBeFalsy();
    });
    it('should not withdraw if approved', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { dateApproved: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.approved);
      
      const { error } = await supertest(app.getHttpServer())
      .post('/poi/withdraw')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: { deletedId: true },
        [DTO_KEY]: { poiId: poiCreateResult.body.id }
      });

      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe('This Proof of Impact has already been approved. Withdrawal denied.');
      }
    });
    it('should not withdraw if denied', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { dateDenied: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.denied);
      
      const { error } = await supertest(app.getHttpServer())
      .post('/poi/withdraw')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: { deletedId: true },
        [DTO_KEY]: { poiId: poiCreateResult.body.id }
      });

      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe('This Proof of Impact has already been denied. Withdrawal denied.');
      }
    });
  });
  describe('pause', () => {
    it('should not pause if in created state', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      expect(calculatePoiStatus(poiCreateResult.body)).toBe(PoiStatus.created);

      const { error } = await supertest(app.getHttpServer())
      .post('/poi/pause')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: {},
        [DTO_KEY]: { poiId: poiCreateResult.body.id }
      });

      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe('This Proof of Impact is not in a valid state to be paused.');
      }
    });
    it('should pause if in started state', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { dateStarted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);

      const { body } = await supertest(app.getHttpServer())
      .post('/poi/pause')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: poiQuery,
        [DTO_KEY]: { poiId: poiCreateResult.body.id }
      });
      expect(calculatePoiStatus(body)).toBe(PoiStatus.paused);
    });
  });
  describe('resume', () => {
    it('should not resume if in created state', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      expect(calculatePoiStatus(poiCreateResult.body)).toBe(PoiStatus.created);

      const { error } = await supertest(app.getHttpServer())
      .post('/poi/resume')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: poiQuery,
        [DTO_KEY]: { poiId: poiCreateResult.body.id }
      });
      
      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe('This Proof of Impact is not in a valid state to be resumed.');
      }
    });
    it('should resume if in paused state', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { dateStarted: new Date(), pausedTimes: [new Date()] }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.paused);

      const { body } = await supertest(app.getHttpServer())
      .post('/poi/resume')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: poiQuery,
        [DTO_KEY]: { poiId: poiCreateResult.body.id }
      });
      expect(calculatePoiStatus(body)).toBe(PoiStatus.started);
    });
  });
  describe('submit', () => {
    it('should not submit if in created state', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      expect(calculatePoiStatus(poiCreateResult.body)).toBe(PoiStatus.created);

      const { error } = await supertest(app.getHttpServer())
      .post('/poi/submit')
      .set('token', token)
      .field(QUERY_KEY, JSON.stringify(poiQuery))
      .field(DTO_KEY, JSON.stringify({ poiId: poiCreateResult.body.id, answers: [] }));
      
      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe('This Proof of Impact is not in a valid state to be submitted.');
      }
    });
    it('should submit if in started state', async () => {
      await projectRepo.update(project.id, { requireImages: false });
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { dateStarted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);

      const { body } = await supertest(app.getHttpServer())
      .post('/poi/submit')
      .set('token', token)
      .field(QUERY_KEY, JSON.stringify(poiQuery))
      .field(DTO_KEY, JSON.stringify({ poiId: poiCreateResult.body.id, answers: [] }));

      expect(calculatePoiStatus(body)).toBe(PoiStatus.submitted);
    });
    it('should submit if in paused state', async () => {
      await projectRepo.update(project.id, { requireImages: false });
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { pausedTimes: [new Date()] }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.paused);
      
      const { body } = await supertest(app.getHttpServer())
      .post('/poi/submit')
      .set('token', token)
      .field(QUERY_KEY, JSON.stringify(poiQuery))
      .field(DTO_KEY, JSON.stringify({ poiId: poiCreateResult.body.id, answers: [] }));

      expect(calculatePoiStatus(body)).toBe(PoiStatus.submitted);
    });
    it('should submit if in stopped state', async () => {
      await projectRepo.update(project.id, { requireImages: false });
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { dateStopped: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.stopped);
      
      const { body } = await supertest(app.getHttpServer())
      .post('/poi/submit')
      .set('token', token)
      .field(QUERY_KEY, JSON.stringify(poiQuery))
      .field(DTO_KEY, JSON.stringify({ poiId: poiCreateResult.body.id, answers: [] }));

      expect(calculatePoiStatus(body)).toBe(PoiStatus.submitted);
    });
    it('should not submit if images are required and none are given', async () => {
      await projectRepo.update(project.id, { requireImages: true });
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { dateStarted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);
      
      const { error } = await supertest(app.getHttpServer())
      .post('/poi/submit')
      .set('token', token)
      .field(QUERY_KEY, JSON.stringify(poiQuery))
      .field(DTO_KEY, JSON.stringify({ poiId: poiCreateResult.body.id, answers: [] }));
      
      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe('This Proof of Impact requires at least one image upon submission.');
      }
    });
    it('should submit if images are required and at least one is given', async () => {
      await projectRepo.update(project.id, { requireImages: true });
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { dateStarted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);

      const { body } = await supertest(app.getHttpServer())
      .post('/poi/submit')
      .set('token', token)
      .field(QUERY_KEY, JSON.stringify(poiQuery))
      .field(DTO_KEY, JSON.stringify({ poiId: poiCreateResult.body.id, answers: [] }))
      .attach(FILES_KEY, Buffer.from('dummy'), {filename: 'file.txt'});

      expect(calculatePoiStatus(body)).toBe(PoiStatus.submitted);
    });
    it('should not submit if questions are required and none is given', async () => {
      await projectRepo.update(project.id, {
        requireImages: false,
        questions: [{ id: uuid.v4(), answers: [], text: '' }],
      });
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { dateStarted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);
      
      const { error } = await supertest(app.getHttpServer())
      .post('/poi/submit')
      .set('token', token)
      .field(QUERY_KEY, JSON.stringify(poiQuery))
      .field(DTO_KEY, JSON.stringify({ poiId: poiCreateResult.body.id, answers: [] }));

      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe(`This Proof of Impact requires the submission of answers to 1 questions.`);
      }
    });
    it('should submit if questions are required and the correct amount is given', async () => {
      const qId = uuid.v4();
      await projectRepo.update(project.id, {
        requireImages: false,
        questions: [{ id: qId, answers: [], text: '' }],
      });
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { dateStarted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);

      const { body } = await supertest(app.getHttpServer())
      .post('/poi/submit')
      .set('token', token)
      .field(QUERY_KEY, JSON.stringify(poiQuery))
      .field(DTO_KEY, JSON.stringify({ poiId: poiCreateResult.body.id, answers: [{ questionId: qId, answer: 'answer' }] }));
      
      expect(calculatePoiStatus(body)).toBe(PoiStatus.submitted);
    });
  });
  describe('approve', () => {
    it('should not approve if in created state', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      expect(calculatePoiStatus(poiCreateResult.body)).toBe(PoiStatus.created);

      const { error } = await supertest(app.getHttpServer())
        .post('/poi/approve')
        .set('token', poiApproverOrDenyer)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { poiId: poiCreateResult.body.id }
        });

      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe('This Proof of Impact must first be submitted to be approved.');
      }
    });
    it('should not approve if in started state', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { dateStarted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);

      const { error } = await supertest(app.getHttpServer())
        .post('/poi/approve')
        .set('token', poiApproverOrDenyer)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { poiId: poiCreateResult.body.id }
        });
      
        if(error !== false)
        {
          expect(JSON.parse(error.text).message).toBe('This Proof of Impact must first be submitted to be approved.');
        }
    });
    it('should not approve if in paused state', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { pausedTimes: [new Date()] }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.paused);

      const { error } = await supertest(app.getHttpServer())
        .post('/poi/approve')
        .set('token', poiApproverOrDenyer)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { poiId: poiCreateResult.body.id }
        });
      
      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe('This Proof of Impact must first be submitted to be approved.');
      }
    });
    it('should not approve if in resumed state', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { pausedTimes: [new Date()], resumedTimes: [new Date()] }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);
      
      const { error } = await supertest(app.getHttpServer())
        .post('/poi/approve')
        .set('token', poiApproverOrDenyer)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { poiId: poiCreateResult.body.id }
        });
      
      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe('This Proof of Impact must first be submitted to be approved.');
      }
    });
    it('should not approve if in stopped state', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { dateStopped: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.stopped);
      
      const { error } = await supertest(app.getHttpServer())
        .post('/poi/approve')
        .set('token', poiApproverOrDenyer)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { poiId: poiCreateResult.body.id }
        });

      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe('This Proof of Impact must first be submitted to be approved.');
      }
    });
    it('should not approve if in denied state', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { dateDenied: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.denied);
      
      const { error } = await supertest(app.getHttpServer())
        .post('/poi/approve')
        .set('token', poiApproverOrDenyer)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { poiId: poiCreateResult.body.id }
        });
      
        if(error !== false)
        {
          expect(JSON.parse(error.text).message).toBe('This Proof of Impact must first be submitted to be approved.');
        }
    });
    it('should approve if in submitted state', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(
        poiCreateResult.body.id,
        { dateSubmitted: new Date(), dateStarted: new Date(), dateStopped: new Date() },
        poiQuery
      );
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.submitted);
      
      const { body } = await supertest(app.getHttpServer())
        .post('/poi/approve')
        .set('token', poiApproverOrDenyer)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { poiId: poiCreateResult.body.id }
        });
      
      expect(calculatePoiStatus(body)).toBe(PoiStatus.approved);
    });
    it('should create if in submitted state with correct amount of credits', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(
        poiCreateResult.body.id,
        {
          dateSubmitted: new Date(),
          dateStarted: new Date(2020, 0, 0, 0, 0, 0),
          dateStopped: new Date(2020, 0, 0, 0, 0, 3600 / 6),
        },
        poiQuery
      );
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.submitted);
      
      const { body } = await supertest(app.getHttpServer())
        .post('/poi/approve')
        .set('token', poiApproverOrDenyer)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { poiId: poiCreateResult.body.id }
        });
      
      expect(calculatePoiStatus(body)).toBe(PoiStatus.approved);
      const credits = await creditRepo.findAll();
      expect(credits[0].amount).toBe(ImConfig.creditsPerHour / 6);
    });
  });
  describe('deny', () => {
    it('should not deny if in created state', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      expect(calculatePoiStatus(poiCreateResult.body)).toBe(PoiStatus.created);

      const { error } = await supertest(app.getHttpServer())
        .post('/poi/deny')
        .set('token', poiApproverOrDenyer)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: {},
          [DTO_KEY]: { poiId: poiCreateResult.body.id }
        });
      
      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe('This Proof of Impact must first be submitted to be denied.');
      }
    });
    it('should not deny if in started state', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { dateStarted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);
      
      const { error } = await supertest(app.getHttpServer())
        .post('/poi/deny')
        .set('token', poiApproverOrDenyer)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: {},
          [DTO_KEY]: { poiId: poiCreateResult.body.id }
        });
      
      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe('This Proof of Impact must first be submitted to be denied.');

      }
    });
    it('should not deny if in paused state', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { pausedTimes: [new Date()] }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.paused);
      
      const { error } = await supertest(app.getHttpServer())
        .post('/poi/deny')
        .set('token', poiApproverOrDenyer)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: {},
          [DTO_KEY]: { poiId: poiCreateResult.body.id }
        });
      
      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe('This Proof of Impact must first be submitted to be denied.');
      }

    });
    it('should not deny if in resumed state', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { pausedTimes: [new Date()], resumedTimes: [new Date()] }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.started);
      
      const { error } = await supertest(app.getHttpServer())
        .post('/poi/deny')
        .set('token', poiApproverOrDenyer)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: {},
          [DTO_KEY]: { poiId: poiCreateResult.body.id }
        });
      
      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe('This Proof of Impact must first be submitted to be denied.');
      }
    });
    it('should not deny if in stopped state', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { dateStopped: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.stopped);
      
      const { error } = await supertest(app.getHttpServer())
        .post('/poi/deny')
        .set('token', poiApproverOrDenyer)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: {},
          [DTO_KEY]: { poiId: poiCreateResult.body.id }
        });
      
      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe('This Proof of Impact must first be submitted to be denied.');
      }
    });
    it('should not deny if in denied state', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { dateDenied: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.denied);
      
      const { error } = await supertest(app.getHttpServer())
        .post('/poi/deny')
        .set('token', poiApproverOrDenyer)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: {},
          [DTO_KEY]: { poiId: poiCreateResult.body.id }
        });
      
      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe('This Proof of Impact must first be submitted to be denied.');
      }
    });

    it('should deny if in submitted state', async () => {
      const poiCreateResult = await supertest(app.getHttpServer())
        .post('/poi/create')
        .set('token', token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { enrollmentId: enrollment.id }
        });
      const poi = await poiRepo.update(poiCreateResult.body.id, { dateSubmitted: new Date() }, poiQuery);
      expect(calculatePoiStatus(poi)).toBe(PoiStatus.submitted);
      const { body } = await supertest(app.getHttpServer())
        .post('/poi/deny')
        .set('token', poiApproverOrDenyer)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          [QUERY_KEY]: poiQuery,
          [DTO_KEY]: { poiId: poiCreateResult.body.id }
        });
      
      expect(calculatePoiStatus(body)).toBe(PoiStatus.denied);
    });
  });
});
