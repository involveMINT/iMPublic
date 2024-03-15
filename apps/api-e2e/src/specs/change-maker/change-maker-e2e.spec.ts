import { ChangeMakerRepository } from '@involvemint/server/core/domain-services';
import { ChangeMaker, IChangeMakerOrchestration, IUserOrchestration, User } from '@involvemint/shared/domain';
import { HttpStatus } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { createQuery, IParser } from '@involvemint/shared/domain';
import { ITestOrchestration } from '@orcha/testing';
import { AppTestModule } from '../../core/app-test.module';
import { DatabaseService } from '../../core/database.service';
import { createUserOrchestration } from '../user/user.orchestration';
import { createChangeMakerOrchestration } from './change-maker.orchestration';
const { default: axios } = require('axios');

describe('ChangeMaker Orchestration Integration Tests', () => {
  let app: NestFastifyApplication;
  let db: DatabaseService;

  let userOrcha: ITestOrchestration<IUserOrchestration>;
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
    cmRepo = moduleRef.get(ChangeMakerRepository);

    await app.init();
  });

  beforeEach(async () => {
    await db.clearDb();
    auth = await userOrcha.signUp({ token: true }, '', creds);
    try {
      const { body, statusCode } = await axios.post('http://localhost:3335/change-maker/createProfile', {
        query: cmQuery,
        token: auth.body.token,
        dto: {
          handle: 'bobby',
          firstName: 'fn',
          lastName: 'ln',
          phone: '(555) 555-5555',
        },
      });

      if (statusCode === HttpStatus.CREATED) {
        cmProfile = body;
      }
      else {
        console.log('Error creating Change Maker profile: ', statusCode)
      }
    } catch (error) {
      console.log('Error creating Change Maker profile: ', error);
    }
  });

  afterAll(async () => await app.close());

  describe('createProfile', () => {
    it('should create profile', async () => {
      const res = await axios.post('http://localhost:3335/user/getUserData', {
        query: userQuery,
        token: auth.body.token,
      });
      const cmEntity = await cmRepo.findOneOrFail(cmProfile.id, cmQuery);
      expect(res.body.changeMaker).toMatchObject(cmEntity);
    });

    it('should verify handle uniqueness', async () => {
      const { error } = await axios.post('http://localhost:3335/change-maker/createProfile', {
        query: cmQuery,
        token: auth.body.token,
        dto: {
          firstName: 'Bobby',
          lastName: 'Smith',
          handle: 'bobby',
          phone: '(412) 232-2953',
        },
      });
      expect(error).toBe(`Handle @bobby already exists.`);
    });
  });

  describe('editProfile', () => {
    it('should edit profile', async () => {
      const firstName = 'Jessie';
      await axios.post('http://localhost:3335/change_maker/editProfile', {
        query: cmQuery,
        token: auth.body.token,
        dto: { firstName },
      })
      const res = await axios.post('http://localhost:3335/user/getUserData', {
        query: userQuery,
        token: auth.body.token,
      })
      expect(res.body.changeMaker?.firstName).toBe(firstName);
    });
  });
});
