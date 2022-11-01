import {
  ProjectRepository,
  ServeAdminRepository,
  ServePartnerRepository,
} from '@involvemint/server/core/domain-services';
import { IProjectOrchestration, IUserOrchestration, Project, ServePartner } from '@involvemint/shared/domain';
import { HttpStatus } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { createQuery, IParser } from '@orcha/common';
import { ITestOrchestration } from '@orcha/testing';
import * as uuid from 'uuid';
import { AppTestModule } from '../../core/app-test.module';
import { DatabaseService } from '../../core/database.service';
import { createServeAdmin } from '../serve-admin/serve-admin.helpers';
import { createServePartner } from '../serve-partner/serve-partner.helpers';
import { createUserOrchestration } from '../user/user.orchestration';
import { createProjectOrchestration } from './project.orchestration';

describe('ChangeMaker Orchestration Integration Tests', () => {
  let app: NestFastifyApplication;
  let db: DatabaseService;

  let userOrcha: ITestOrchestration<IUserOrchestration>;
  let projectOrcha: ITestOrchestration<IProjectOrchestration>;

  let spRepo: ServePartnerRepository;
  let saRepo: ServeAdminRepository;
  let projectRepo: ProjectRepository;

  const creds = { id: 'email@email.com', password: 'GoodPwd341' };
  let auth: { body: { token: string }; statusCode: HttpStatus };

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

    userOrcha = createUserOrchestration(app);
    projectOrcha = createProjectOrchestration(app);

    spRepo = moduleRef.get(ServePartnerRepository);
    saRepo = moduleRef.get(ServeAdminRepository);
    projectRepo = moduleRef.get(ProjectRepository);

    await app.init();
  });

  beforeEach(async () => {
    await db.clearDb();
    auth = await userOrcha.signUp({ token: true }, '', creds);
    sp = await createServePartner(spQuery, spRepo, { id: uuid.v4(), handle: 'spHandle' });
    await createServeAdmin({}, saRepo, creds.id, sp.id);
    const { body } = await projectOrcha.create(projectQuery, auth.body.token, { spId: sp.id });
    project = body;
  });

  afterAll(async () => await app.close());

  describe('getAll', () => {
    it('should not get private projects (project is private by default)', async () => {
      const res = await projectOrcha.getAll(projectQuery, auth.body.token, {});
      expect(res.body.length).toBe(0);
    });
    it('should not get unlisted projects', async () => {
      await projectRepo.update(project.id, { listingStatus: 'unlisted' });
      const res = await projectOrcha.getAll(projectQuery, auth.body.token, {});
      expect(res.body.length).toBe(0);
    });
    it('should get public projects', async () => {
      await projectRepo.update(project.id, { listingStatus: 'public' });
      const res = await projectOrcha.getAll(projectQuery, auth.body.token, {});
      expect(res.body[0].id).toBe(project.id);
    });
  });

  describe('getOne', () => {
    it('should not get private project (project is private by default)', async () => {
      const res = await projectOrcha.getOne(projectQuery, auth.body.token, { projectId: project.id });
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
    it('should get unlisted project', async () => {
      await projectRepo.update(project.id, { listingStatus: 'unlisted' });
      const res = await projectOrcha.getOne(projectQuery, auth.body.token, { projectId: project.id });
      expect(res.body.id).toBe(project.id);
    });
    it('should get public project', async () => {
      await projectRepo.update(project.id, { listingStatus: 'public' });
      const res = await projectOrcha.getOne(projectQuery, auth.body.token, { projectId: project.id });
      expect(res.body.id).toBe(project.id);
    });
  });

  describe('getAllOwnedBySp', () => {
    it('should get only projects owned by me', async () => {
      const res = await projectOrcha.getAllOwnedBySp(projectQuery, auth.body.token, { spId: sp.id });
      expect(res.body[0].id).toBe(project.id);
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
      const res = await projectOrcha.getAllOwnedBySp(projectQuery, auth.body.token, { spId: sp.id });
      expect(res.body.length).toBe(0);
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
      expect(
        (await projectOrcha.delete({ deletedId: true }, auth.body.token, { projectId: project.id })).body
          .deletedId
      ).toBe(project.id);
      expect(await projectRepo.findOne(project.id)).toBeFalsy();
    });
  });
});
