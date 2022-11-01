import { HandleRepository } from '@involvemint/server/core/domain-services';
import { IHandleOrchestration } from '@involvemint/shared/domain';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ITestOrchestration } from '@orcha/testing';
import { AppTestModule } from '../../core/app-test.module';
import { DatabaseService } from '../../core/database.service';
import { createHandleOrchestration } from './handle.orchestration';

describe('User Orchestration Integration Tests', () => {
  let app: INestApplication;
  let db: DatabaseService;

  let handleOrcha: ITestOrchestration<IHandleOrchestration>;

  let handleRepo: HandleRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppTestModule],
      providers: [DatabaseService],
    }).compile();

    app = moduleRef.createNestApplication();
    db = moduleRef.get(DatabaseService);
    handleRepo = moduleRef.get(HandleRepository);

    handleOrcha = createHandleOrchestration(app);

    await app.init();
  });

  beforeEach(async () => {
    await db.clearDb();
  });

  afterAll(async () => await app.close());

  describe('verifyHandle', () => {
    it('should verify handle is unique', async () => {
      const { body } = await handleOrcha.verifyHandle({ isUnique: true }, '', { handle: 'myHandle' });
      expect(body.isUnique).toBe(true);
    });
    it('should verify handle is not unique', async () => {
      await handleRepo.upsert({ id: 'myHandle' });
      const { body } = await handleOrcha.verifyHandle({ isUnique: true }, '', { handle: 'myHandle' });
      expect(body.isUnique).toBe(false);
    });
  });
});
