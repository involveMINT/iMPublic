import { UserRepository } from '@involvemint/server/core/domain-services';
import { DTO_KEY, environment, QUERY_KEY, TOKEN_KEY } from '@involvemint/shared/domain';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppTestModule } from '../../core/app-test.module';
import { DatabaseService } from '../../core/database.service';
import supertest from 'supertest';

describe('User Integration Tests', () => {
  let app: INestApplication;
  let db: DatabaseService;
  let userRepo: UserRepository;

  const creds = { id: 'email@email.com', password: 'GoodPwd@341' };
  let auth: { body: { token: string }; statusCode: HttpStatus };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppTestModule],
      providers: [DatabaseService],
    }).compile();

    app = moduleRef.createNestApplication();
    db = moduleRef.get(DatabaseService);
    userRepo = moduleRef.get(UserRepository);

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
    auth = signUpResult;
  });

  afterAll(async () => await app.close());

  describe('signUp', () => {
    it('should signUp', async () => {
      expect(typeof auth.body.token).toBe('string');
      expect(auth.statusCode).toBe(HttpStatus.CREATED);
    });
    it('should not login with unknown user', async () => {
      const { error } = await supertest(app.getHttpServer())
      .post('/user/login')
      .send({
        [QUERY_KEY]: { [TOKEN_KEY]: true },
        [DTO_KEY]: {
          id: 'who@dis.com',
          password: 'Idk12345!',
        }
      });

      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe(`User "who@dis.com" does not exist.`);
      }
    });
    it('should not signUp if user email already exists', async () => {
      const { error } = await supertest(app.getHttpServer())
      .post('/user/signUp')
      .send({
        [QUERY_KEY]: { [TOKEN_KEY]: true },
        [DTO_KEY]: creds,
      });

      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe(`User with email "${creds.id}" already exists.`);
      }
    });
  });
  describe('login', () => {
    it('should login', async () => {
      auth = await supertest(app.getHttpServer())
      .post('/user/login')
      .set(TOKEN_KEY, auth.body.token)
      .send({
        [QUERY_KEY]: { [TOKEN_KEY]: true },
        [DTO_KEY]: creds
      });
      expect(typeof auth.body.token).toBe('string');
      expect(auth.statusCode).toBe(HttpStatus.CREATED);
    });
    it('should not login with wrong password', async () => {
      const {statusCode, error } = await supertest(app.getHttpServer())
      .post('/user/login')
      .send({
        [QUERY_KEY]: { [TOKEN_KEY]: true },
        [DTO_KEY]: {
          ...creds,
          password: 'nope',
        }
      });

      expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
      if(error !== false)
      {
        expect(JSON.parse(error.text).message).toBe(`Incorrect password.`);
      }
    });
  });

  describe('getUserData', () => {
    it('should get user data', async () => {
      const { body } = await supertest(app.getHttpServer())
      .post('/user/getUserData')
      .set(TOKEN_KEY, auth.body.token)
      .send({
        [QUERY_KEY]: { id: true }
      });
      expect(body.id).toBe(creds.id);
    });

    /**
     * It should never be the case the user gets an auth
     * token without verifying their email, but check anyways.
     */
    it('should not give user data if unverified email', async () => {
      environment.environment = 'production';
      const { statusCode } = await supertest(app.getHttpServer())
      .post('/user/getUserData')
      .send({
        [QUERY_KEY]: {}
      });
      expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
      environment.environment = 'local';
    });
  });

  describe('resendEmailVerificationEmail', () => {
    it('should change activation hash', async () => {
      const { activationHash } = await userRepo.findOneOrFail(creds.id);
      expect(activationHash).toBeFalsy;
      const { statusCode } = await supertest(app.getHttpServer())
      .post('/user/resendEmailVerificationEmail')
      .send({
        [QUERY_KEY]: {},
        [DTO_KEY]: { userId: creds.id }
      });
      expect(statusCode).toBe(HttpStatus.CREATED);
      const user = await userRepo.findOneOrFail(creds.id);
      expect(user.activationHash).not.toBe(activationHash);
    });
  });

  describe('verifyEmail', () => {
    it('should verify email address', async () => {
      let user = await userRepo.findOneOrFail(creds.id);
      expect(user.active).toBe(false);
      await supertest(app.getHttpServer())
      .post('/user/verifyEmail')
      .send({
        [QUERY_KEY]: {},
        [DTO_KEY]: { email: user.id, hash: user.activationHash ?? '' }
      });
      user = await userRepo.findOneOrFail(creds.id);
      expect(user.active).toBe(true);
    });
    it('should fail to verify email address if hash is mismatched', async () => {
      let user = await userRepo.findOneOrFail(creds.id);
      expect(user.active).toBe(false);
      await supertest(app.getHttpServer())
      .post('/user/verifyEmail')
      .send({
        [QUERY_KEY]: {},
        [DTO_KEY]: { email: user.id, hash: 'wrong hash' }
      });
      user = await userRepo.findOneOrFail(creds.id);
      expect(user.active).toBe(false);
    });
  });

  describe('forgotPassword and forgotPasswordChange', () => {
    async function forgotPassword() {
      let user = await userRepo.findOneOrFail(creds.id);
      expect(user.forgotPasswordHash).toBeFalsy();
      await supertest(app.getHttpServer())
      .post('/user/forgotPassword')
      .send({
        [QUERY_KEY]: {},
        [DTO_KEY]: { email: user.id }
      });
      user = await userRepo.findOneOrFail(creds.id);
      expect(user.forgotPasswordHash).toBeTruthy();
    }
    it('should allow password change if hash is correct', async () => {
      await forgotPassword();
      let user = await userRepo.findOneOrFail(creds.id);

      const password = 'NewPassword!1';
      await supertest(app.getHttpServer())
      .post('/user/forgotPasswordChange')
      .send({
        [QUERY_KEY]: {},
        [DTO_KEY]: {
          email: user.id,
          hash: user.forgotPasswordHash ?? '',
          password,
        }
      });
      user = await userRepo.findOneOrFail(creds.id);
      expect(user.forgotPasswordHash).toBeFalsy();

      const res  = await supertest(app.getHttpServer())
      .post('/user/login')
      .send({
        [QUERY_KEY]: { [TOKEN_KEY]: true },
        [DTO_KEY]: { id: user.id, password }
      });

      expect(typeof res.body.token).toBe('string');
      expect(res.statusCode).toBe(HttpStatus.CREATED);
    });
    it('should forbid password change if hash is incorrect', async () => {
      await forgotPassword();
      let user = await userRepo.findOneOrFail(creds.id);

      const password = 'NewPassword!1';
      const res = await supertest(app.getHttpServer())
      .post('/user/forgotPasswordChange')
      .send({
        [QUERY_KEY]: {},
        [DTO_KEY]: {
          email: user.id,
          hash: 'wrong hash',
          password,
        }
      });

      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      user = await userRepo.findOneOrFail(creds.id);
      expect(user.forgotPasswordHash).toBeTruthy();
    });
  });

  describe('changePassword', () => {
    it('should change password if current password is correct', async () => {
      const password = 'NewPassword!1';
      const changePwdRes = await supertest(app.getHttpServer())
      .post('/user/changePassword')
      .set(TOKEN_KEY, auth.body.token)
      .send({
        [QUERY_KEY]: {},
        [DTO_KEY]: {
          currentPassword: creds.password,
          newPassword: password,
        }
      });

      expect(changePwdRes.statusCode).toBe(HttpStatus.CREATED);

      const loginRes  = await supertest(app.getHttpServer())
      .post('/user/login')
      .send({
        [QUERY_KEY]: { [TOKEN_KEY]: true },
        [DTO_KEY]: { id: creds.id, password }
      });

      expect(typeof loginRes.body.token).toBe('string');
      expect(loginRes.statusCode).toBe(HttpStatus.CREATED);
    });
    it('should forbid password change if current password is incorrect', async () => {
      const password = 'NewPassword!1';
      const changePwdRes  = await supertest(app.getHttpServer())
      .post('/user/changePassword')
      .set(TOKEN_KEY, auth.body.token)
      .send({
        [QUERY_KEY]: {},
        [DTO_KEY]: {
          currentPassword: 'WrongPassword!1',
          newPassword: password,
        }
      });

      expect(changePwdRes.statusCode).toBe(HttpStatus.UNAUTHORIZED);

      const loginRes  = await supertest(app.getHttpServer())
      .post('/user/login')
      .send({
        [QUERY_KEY]: { [TOKEN_KEY]: true },
        [DTO_KEY]: { id: creds.id, password }
      });

      expect(loginRes.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });
});
