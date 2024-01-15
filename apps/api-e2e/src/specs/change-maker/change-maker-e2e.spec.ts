import { ChangeMakerRepository } from '@involvemint/server/core/domain-services';
import { ChangeMaker, IChangeMakerOrchestration, IUserOrchestration, User } from '@involvemint/shared/domain';
import { HttpStatus } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { createQuery, IParser } from '@orcha/common';
import { ITestOrchestration } from '@orcha/testing';
import { AppTestModule } from '../../core/app-test.module';
import { DatabaseService } from '../../core/database.service';
import { createUserOrchestration } from '../user/user.orchestration';
import { createChangeMakerOrchestration } from './change-maker.orchestration';

describe('ChangeMaker Orchestration Integration Tests', () => {
  let app: NestFastifyApplication;
  let db: DatabaseService;

  let userOrcha: ITestOrchestration<IUserOrchestration>;
  let cmOrcha: ITestOrchestration<IChangeMakerOrchestration>;

  let cmRepo: ChangeMakerRepository;

  const creds = { id: 'email@email.com', password: 'GoodPwd@341' };
  let auth: { body: { token: string }; statusCode: HttpStatus };

  const cmQuery = createQuery<ChangeMaker>()({ id: true, firstName: true, handle: { id: true } });
  let cmProfile: IParser<ChangeMaker, typeof cmQuery>;

  const userQuery = createQuery<User>()({ changeMaker: cmQuery });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppTestModule],
      providers: [DatabaseService],
    }).compile();

    app = moduleRef.createNestApplication();
    db = moduleRef.get(DatabaseService);

    userOrcha = createUserOrchestration(app);
    cmOrcha = createChangeMakerOrchestration(app);

    cmRepo = moduleRef.get(ChangeMakerRepository);

    await app.init();
  });

  beforeEach(async () => {
    await db.clearDb();
    auth = await userOrcha.signUp({ token: true }, '', creds);
    const { body, statusCode } = await cmOrcha.createProfile(cmQuery, auth.body.token, {
      handle: 'bobby',
      firstName: 'fn',
      lastName: 'ln',
      phone: '(555) 555-5555',
    });
    cmProfile = body;
    expect(statusCode).toBe(HttpStatus.CREATED);
  });

  afterAll(async () => await app.close());

  describe('createProfile', () => {
    it('should create profile', async () => {
      const res = await userOrcha.getUserData(userQuery, auth.body.token);
      const cmEntity = await cmRepo.findOneOrFail(cmProfile.id, cmQuery);
      expect(res.body.changeMaker).toMatchObject(cmEntity);
    });

    it('should verify handle uniqueness', async () => {
      const { error } = await cmOrcha.createProfile(cmQuery, auth.body.token, {
        firstName: 'Bobby',
        lastName: 'Smith',
        handle: 'bobby',
        phone: '(412) 232-2953',
      });
      expect(error).toBe(`Handle @bobby already exists.`);
    });
  });

  describe('editProfile', () => {
    it('should edit profile', async () => {
      const firstName = 'Jessie';
      await cmOrcha.editProfile(cmQuery, auth.body.token, { firstName });
      const res = await userOrcha.getUserData(userQuery, auth.body.token);
      expect(res.body.changeMaker?.firstName).toBe(firstName);
    });
  });
});
