import {
  ProjectRepository,
  ServeAdminRepository,
  ServePartnerRepository,
} from '@involvemint/server/core/domain-services';
import { DTO_KEY, IParser, Project, QUERY_KEY, ServePartner, TOKEN_KEY, createQuery } from '@involvemint/shared/domain';
import { HttpStatus } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import * as uuid from 'uuid';
import { AppTestModule } from '../../core/app-test.module';
import { DatabaseService } from '../../core/database.service';
import { createServeAdmin } from '../serve-admin/serve-admin.helpers';
import { createServePartner } from '../serve-partner/serve-partner.helpers';
import supertest from 'supertest'

describe('Project Integration Tests', () => {
  let app: NestFastifyApplication;
  let db: DatabaseService;

  let spRepo: ServePartnerRepository;
  let saRepo: ServeAdminRepository;
  let projectRepo: ProjectRepository;

  const creds = { id: 'email@email.com', password: 'GoodPwd@341' };
  let token: string;

  const spQuery = createQuery<ServePartner>()({ id: true });
  let sp: IParser<ServePartner, typeof spQuery>;

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
    saRepo = moduleRef.get(ServeAdminRepository);
    projectRepo = moduleRef.get(ProjectRepository);

    await app.init();
  });

  beforeEach(async () => {
    await db.clearDb();

    const signUpResult = await supertest(app.getHttpServer())
      .post('/user/signUp')
      .send({
        [QUERY_KEY]: { [TOKEN_KEY]: true },
        [DTO_KEY]: creds,
      });
    token = signUpResult.body[TOKEN_KEY];
    sp = await createServePartner(spQuery, spRepo, { id: uuid.v4(), handle: 'spHandle' });
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

  describe('getAll', () => {
    it('should not get private projects (project is private by default)', async () => {

      const { body } = await supertest(app.getHttpServer())
      .post('/project/getAll')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ 
        [QUERY_KEY]: projectQuery,
        [DTO_KEY]: {}
      });
      
      expect(body.length).toBe(0);
    });
    it('should not get unlisted projects', async () => {
      await projectRepo.update(project.id, { listingStatus: 'unlisted' });
      
      const { body } = await supertest(app.getHttpServer())
      .post('/project/getAll')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ 
        [QUERY_KEY]: projectQuery,
        [DTO_KEY]: {}
      });
      
      expect(body.length).toBe(0);
    });
    it('should get public projects', async () => {
      await projectRepo.update(project.id, { listingStatus: 'public' });
      
      const { body } = await supertest(app.getHttpServer())
      .post('/project/getAll')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ 
        [QUERY_KEY]: projectQuery,
        [DTO_KEY]: {}
      });
      
      expect(body[0].id).toBe(project.id);
    });
  });

  describe('getOne', () => {
    it('should not get private project (project is private by default)', async () => {
      const result = await supertest(app.getHttpServer())
      .post('/project/getOne')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ 
        [QUERY_KEY]: projectQuery,
        [DTO_KEY]: { projectId: project.id }
      });
      expect(result.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
    it('should get unlisted project', async () => {
      await projectRepo.update(project.id, { listingStatus: 'unlisted' });
      const result = await supertest(app.getHttpServer())
      .post('/project/getOne')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ 
        [QUERY_KEY]: projectQuery,
        [DTO_KEY]: { projectId: project.id }
      });
      expect(result.body.id).toBe(project.id);
    });
    it('should get public project', async () => {
      await projectRepo.update(project.id, { listingStatus: 'public' });
      const result = await supertest(app.getHttpServer())
      .post('/project/getOne')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ 
        [QUERY_KEY]: projectQuery,
        [DTO_KEY]: { projectId: project.id }
      });
      expect(result.body.id).toBe(project.id);
    });
  });

  describe('getAllOwnedBySp', () => {
    it('should get only projects owned by me', async () => {
      const result = await supertest(app.getHttpServer())
      .post('/project/getAllOwnedBySp')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ 
        [QUERY_KEY]: projectQuery,
        [DTO_KEY]: { spId: sp.id }
      });
      expect(result.body[0].id).toBe(project.id);
    });
    it('should not get projects not owned by me', async () => {
      const newSpId = uuid.v4();
      await spRepo.upsert(
        {
          id: newSpId,
          admins: [],
          credits: [],
          dateCreated: new Date(),
          email: '',
          handle: { id: 'newSpHandle' },
          imagesFilePaths: [],
          name: '',
          offers: [],
          phone: '',
          projects: [],
          receivingTransactions: [],
          receivingVouchers: [],
          requests: [],
          sendingTransactions: [],
          website: '',
          address: {
            id: uuid.v4(),
            address1: '',
            city: '',
            state: '',
            zip: '',
          },
        },
        spQuery
      );
      await projectRepo.update(project.id, { servePartner: newSpId });
      const result = await supertest(app.getHttpServer())
      .post('/project/getAllOwnedBySp')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ 
        [QUERY_KEY]: projectQuery,
        [DTO_KEY]: { spId: sp.id }
      });
      expect(result.body.length).toBe(0);
    });
  });

  describe('create', () => {
    it('should create', async () => {
      expect((await projectRepo.findOneOrFail(project.id)).id).toBe(project.id);
    });
  });

  describe('delete', () => {
    it('should delete', async () => {
      expect(await projectRepo.findOne(project.id)).toBeTruthy();

      const result = await supertest(app.getHttpServer())
      .post('/project/delete')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ 
        [QUERY_KEY]: { deletedId: true },
        [DTO_KEY]: { projectId: project.id }
      });

      expect(result.body.deletedId).toBe(project.id);
      expect(await projectRepo.findOne(project.id)).toBeFalsy();
    });
  });
});
