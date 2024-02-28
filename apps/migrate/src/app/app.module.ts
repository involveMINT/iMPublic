import { ServerCoreDomainServicesModule } from '@involvemint/server/core/domain-services';
import { ServerAPIModule } from '@involvemint/server/api';
import { environment } from '@involvemint/shared/domain';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';

@Module({
  imports: [
    ServerAPIModule,
    TypeOrmModule.forRoot({
      ...environment.typeOrmConfig,
      database: 'involvemint',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any),
    ScheduleModule.forRoot(),
    ServerCoreDomainServicesModule,
  ],
  providers: [AppService],
})
export class AppModule {}
