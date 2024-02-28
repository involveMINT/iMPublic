import { ServerAPIModule } from '@involvemint/server/api';
import { environment } from '@involvemint/shared/domain';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ServerAPIModule, ScheduleModule.forRoot(), TypeOrmModule.forRoot(environment.typeOrmConfig)],
})
export class AppModule {}
