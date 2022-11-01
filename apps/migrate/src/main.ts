/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { environment } from '@involvemint/shared/domain';
import { NestFactory } from '@nestjs/core';
import * as admin from 'firebase-admin';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import { AppModule } from './app/app.module';
import { AppService } from './app/app.service';

initializeTransactionalContext();
patchTypeORMRepositoryWithBaseRepository();

admin.initializeApp({ credential: admin.credential.cert(environment.gcp) });
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const main = app.get(AppService);
  await main.migrate();
}

bootstrap();
