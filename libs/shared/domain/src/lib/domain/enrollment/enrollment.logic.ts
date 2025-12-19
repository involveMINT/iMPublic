import { createLogic } from '../repository';
import { Enrollment } from './enrollment.model';

export enum EnrollmentStatus {
  started = 'started',
  pending = 'pending',
  enrolled = 'enrolled',
  denied = 'denied',
  retired = 'retired',
}

export const calculateEnrollmentStatus = createLogic<
  Enrollment,
  {
    dateApplied: true;
    dateApproved: true;
    dateDenied: true;
    dateRetired: true;
    dateSubmitted: true;
  }
>()((enrollment) => {
  if (enrollment.dateRetired) {
    return EnrollmentStatus.retired;
  }
  if (enrollment.dateDenied) {
    return EnrollmentStatus.denied;
  }
  if (enrollment.dateApproved) {
    return EnrollmentStatus.enrolled;
  }
  if (enrollment.dateSubmitted) {
    return EnrollmentStatus.pending;
  }
  return EnrollmentStatus.started;
});

export const calculateProjectsHeld = createLogic<
  Enrollment[],
  {
    dateApplied: true;
    dateApproved: true;
    dateDenied: true;
    dateRetired: true;
    dateSubmitted: true;
  }
>()((enrollments) => {
  return enrollments.filter(
    (e) =>
      calculateEnrollmentStatus(e) === EnrollmentStatus.enrolled ||
      calculateEnrollmentStatus(e) === EnrollmentStatus.retired
  ).length;
});
