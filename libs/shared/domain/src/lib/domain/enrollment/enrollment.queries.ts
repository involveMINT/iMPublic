import { createQuery } from '../repository';
import { Enrollment } from './enrollment.model';

export const EnrollmentsQuery = createQuery<Enrollment>()({
  id: true,
  dateApplied: true,
  dateApproved: true,
  dateDenied: true,
  dateRetired: true,
  dateSubmitted: true,
  acceptedWaiver: true,
  enrollmentDocuments: {
    id: true,
    passportDocument: {
      id: true,
      name: true,
    },
    projectDocument: {
      id: true,
    },
  },
  project: {
    id: true,
    title: true,
    imagesFilePaths: true,
    customWaiverFilePath: true,
    requireCustomWaiver: true,
    description: true,
    servePartner: {
      name: true,
    },
    projectDocuments: {
      id: true,
      title: true,
      description: true,
      infoUrl: true,
    },
  },
});

export const EnrollmentsSpQuery = createQuery<Enrollment[]>()({
  id: true,
  dateApplied: true,
  dateApproved: true,
  dateDenied: true,
  dateRetired: true,
  dateSubmitted: true,
  changeMaker: {
    id: true,
    handle: { id: true },
    profilePicFilePath: true,
    firstName: true,
    lastName: true,
    phone: true,
    bio: true,
    user: { id: true },
  },
  enrollmentDocuments: {
    passportDocument: {
      id: true,
      name: true,
      filePath: true,
    },
    projectDocument: {
      id: true,
      title: true,
    },
  },
  project: {
    id: true,
    title: true,
    maxChangeMakers: true,
  },
});
