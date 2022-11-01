import { ServerOrchaModule } from '@involvemint/server/orcha';
import { environment } from '@involvemint/shared/domain';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ServerOrchaModule, ScheduleModule.forRoot(), TypeOrmModule.forRoot(environment.typeOrmConfig)],
})
export class AppModule {}
