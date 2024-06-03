import { ServerAPIModule } from '@involvemint/server/api';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

jest.setTimeout(60000);

initializeTransactionalContext();
patchTypeORMRepositoryWithBaseRepository();

@Module({
  imports: [
    ServerAPIModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5433,
      username: 'postgres',
      password: 'postgres',
      database: 'involvemint-e2e',
      synchronize: true,
      autoLoadEntities: true,
      ssl: false,
    }),
    ScheduleModule.forRoot(),
  ],
})
export class AppTestModule {}