import { Injectable } from '@angular/core';
import {
  ChangeMakerFacade,
  EnrollmentsModalService,
  EnrollmentStoreModel,
} from '@involvemint/client/cm/data-access';
import { ProjectFeedStoreModel } from '@involvemint/client/shared/data-access';

@Injectable()
export class ClientCmApiService {
  enrollments$ = this.cf.enrollments.selectors.enrollments$;

  constructor(
    private readonly cf: ChangeMakerFacade,
    private readonly enrollmentsModal: EnrollmentsModalService
  ) {}

  startApplication(project: ProjectFeedStoreModel) {
    this.cf.enrollments.dispatchers.startApplication(project);
  }

  async newPoi(enrollment?: EnrollmentStoreModel) {
    if (enrollment) {
      return this.cf.poi.dispatchers.create(enrollment);
    }
    const selectedEnrollment = await this.enrollmentsModal.open({
      title: 'Select Project',
      header: 'Which Project do you want to create a Proof of Impact for?',
    });
    selectedEnrollment && this.cf.poi.dispatchers.create(selectedEnrollment);
  }
}
