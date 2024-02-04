import { parseDate } from '@involvemint/shared/util';
import { createLogic } from '../repository';
import { isAfter } from 'date-fns';
import { EnrollmentStatus } from '../enrollment';
import { calculateEnrollmentStatus } from '../enrollment/enrollment.logic';
import { Project } from './project.model';

export enum ProjectStatus {
  open = 'open',
  closed = 'closed',
}

export const calculateProjectStatus = createLogic<
  Project,
  {
    startDate: true;
    endDate: true;
    enrollments: {
      dateApplied: true;
      dateApproved: true;
      dateDenied: true;
      dateRetired: true;
      dateSubmitted: true;
    };
    maxChangeMakers: true;
  }
>()((project) => {
  const currentDate = new Date();
  if (
    (project.endDate && isAfter(currentDate, parseDate(project.endDate))) ||
    calculateEnrolledEnrollments(project, EnrollmentStatus.enrolled) >= project.maxChangeMakers
  ) {
    return ProjectStatus.closed;
  }
  return ProjectStatus.open;
});

export const calculateEnrolledEnrollments = createLogic<
  Project,
  {
    startDate: true;
    endDate: true;
    enrollments: {
      dateApplied: true;
      dateApproved: true;
      dateDenied: true;
      dateRetired: true;
      dateSubmitted: true;
    };
    maxChangeMakers: true;
  }
>()((project, status: EnrollmentStatus) => {
  return project.enrollments.filter((e) => calculateEnrollmentStatus(e) === status).length;
});
