import { TaskRepository } from '@involvemint/server/core/domain-services';
import { calculatePoiMandatoryClockOutDate, calculatePoiStatus, PoiStatus } from '@involvemint/shared/domain';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { isBefore, isEqual } from 'date-fns';
import { PoiService } from '../poi/poi.service';

@Injectable()
export class AppInitService implements OnApplicationBootstrap {
  constructor(
    private readonly taskRepo: TaskRepository,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly poi: PoiService
  ) {}

  async onApplicationBootstrap() {
    // Find tasks in Tasks table and reinitialize cron jobs.
    const tasks = await this.taskRepo.findAll({
      id: true,
      poi: {
        id: true,
        enrollment: { project: { creditsEarned: true } },
        dateStarted: true,
        dateApproved: true,
        dateCreated: true,
        dateDenied: true,
        dateStopped: true,
        dateSubmitted: true,
        resumedTimes: true,
        pausedTimes: true,
      },
    });

    for (const task of tasks) {
      if (calculatePoiStatus(task.poi) !== PoiStatus.started) {
        continue;
      }

      const mandatoryClockOutDate = calculatePoiMandatoryClockOutDate(task.poi);

      const job = new CronJob(mandatoryClockOutDate, () => this.poi.stopNoAuth({ poiId: task.poi.id }));
      this.schedulerRegistry.addCronJob(task.id, job);

      const now = new Date();
      if (isBefore(mandatoryClockOutDate, now) || isEqual(mandatoryClockOutDate, now)) {
        await this.poi.stopNoAuth({ poiId: task.poi.id });
        continue;
      }

      job.start();
    }
  }
}
