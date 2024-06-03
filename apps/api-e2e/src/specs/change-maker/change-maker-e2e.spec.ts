
import { ChangeMakerRepository } from '@involvemint/server/core/domain-services';
import { ChangeMaker, DTO_KEY, EditCmProfileDto, QUERY_KEY, TOKEN_KEY, User } from '@involvemint/shared/domain';
import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import supertest from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createQuery, IParser } from '@involvemint/shared/domain';
import { AppTestModule } from '../../core/app-test.module';
import { DatabaseService } from '../../core/database.service';

describe('ChangeMaker Integration Tests', () => {
  let app: INestApplication;
  let db: DatabaseService;

  let cmRepo: ChangeMakerRepository;

  const creds = { id: 'email@email.com', password: 'GoodPwd@341' };
  let token: string;

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

    cmRepo = moduleRef.get(ChangeMakerRepository);

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
  });

  afterAll(async () => await app.close());

  describe('createProfile', () => {
    it('should create profile', async () => {
      const getUserData = await supertest(app.getHttpServer())
        .post('/user/getUserData')
        .set(TOKEN_KEY, token)
        .send({
          [QUERY_KEY]: userQuery
        });
      
      const cmEntity = await cmRepo.findOneOrFail(cmProfile.id, cmQuery);
      expect(getUserData.body.changeMaker).toMatchObject(cmEntity);
      
    });

    it('should verify handle uniqueness', async () => {

      const profileCreationResult = await supertest(app.getHttpServer())
      .post('/changeMaker/createProfile')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: cmQuery,
        [DTO_KEY]: {
          firstName: 'Bobby',
          lastName: 'Smith',
          handle: 'bobby',
          phone: '(412) 232-2953',
        }
      });
      
      if(profileCreationResult.error !== false)
      {
        expect(JSON.parse(profileCreationResult.error.text).message).toBe(`Handle @bobby already exists.`);
      }

    });
  });

  describe('editProfile', () => {
    it('should edit profile', async () => {
      const firstName = 'Jessie';

      const editProfileArgument: EditCmProfileDto = {
        firstName: 'Jessie'
      }
      await supertest(app.getHttpServer())
      .post('/changeMaker/editProfile')
      .set('token', token)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: cmQuery,
        [DTO_KEY]: editProfileArgument
      });

      const getUserDataResponse = await supertest(app.getHttpServer())
      .post('/user/getUserData')
      .set(TOKEN_KEY, token)
      .send({
        [QUERY_KEY]: userQuery
      });

      expect(getUserDataResponse.body.changeMaker?.firstName).toBe(firstName);
    });
  });
});
