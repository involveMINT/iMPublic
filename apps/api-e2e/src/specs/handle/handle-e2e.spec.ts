import { HandleRepository } from '@involvemint/server/core/domain-services';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppTestModule } from '../../core/app-test.module';
import { DatabaseService } from '../../core/database.service';
import supertest from 'supertest';
import { DTO_KEY, QUERY_KEY } from '@involvemint/shared/domain';

describe('Handle Integration Tests', () => {
  let app: INestApplication;
  let db: DatabaseService;

  let handleRepo: HandleRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppTestModule],
      providers: [DatabaseService],
    }).compile();

    app = moduleRef.createNestApplication();
    db = moduleRef.get(DatabaseService);
    handleRepo = moduleRef.get(HandleRepository);

    await app.init();
  });

  beforeEach(async () => {
    await db.clearDb();
  });

  afterAll(async () => await app.close());

  describe('verifyHandle', () => {
    it('should verify handle is unique', async () => {
      const verifyHandleResult = await supertest(app.getHttpServer())
      .post('/handle/verifyHandle')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: { isUnique: true },
        [DTO_KEY]: { handle: 'myHandle' }
      });

      expect(verifyHandleResult.body.isUnique).toBe(true);
    });
    it('should verify handle is not unique', async () => {
      await handleRepo.upsert({ id: 'myHandle' });
      const verifyHandleResult = await supertest(app.getHttpServer())
      .post('/handle/verifyHandle')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        [QUERY_KEY]: { isUnique: true },
        [DTO_KEY]: { handle: 'myHandle' }
      });

      expect(verifyHandleResult.body.isUnique).toBe(false);
    });
  });
});
