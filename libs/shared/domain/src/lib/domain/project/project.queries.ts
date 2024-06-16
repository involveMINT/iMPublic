import { createQuery } from '../repository';
import { Project } from './project.model';

export const ProjectFeedQuery = createQuery<Project[]>()({
  id: true,
  title: true,
  imagesFilePaths: true,
  description: true,
  creditsEarned: true,
  preferredScheduleOfWork: true,
  startDate: true,
  endDate: true,
  listingStatus: true,
  requireLocation: true,
  requireImages: true,
  maxChangeMakers: true,
  dateCreated: true,
  enrollments: {
    dateApplied: true,
    dateApproved: true,
    dateDenied: true,
    dateRetired: true,
    dateSubmitted: true,
  },
  projectDocuments: {
    title: true,
    description: true,
  },
  address: {
    id: true,
    address1: true,
    address2: true,
    address3: true,
    city: true,
    state: true,
    zip: true,
    country: true,
  },
  questions: {
    id: true,
    text: true,
  },
  servePartner: {
    id: true,
    handle: { id: true },
    name: true,
  },
  __paginate: {
    limit: 100,
    page: 1,
  },
});

export const ProjectSpQuery = createQuery<Project>()({
  id: true,
  title: true,
  imagesFilePaths: true,
  description: true,
  listingStatus: true,
  creditsEarned: true,
  preferredScheduleOfWork: true,
  startDate: true,
  endDate: true,
  requireLocation: true,
  requireImages: true,
  maxChangeMakers: true,
  dateCreated: true,
  customWaiverFilePath: true,
  requireCustomWaiver: true,
  servePartner: {
    id: true,
    name: true,
  },
  address: {
    id: true,
    address1: true,
    address2: true,
    address3: true,
    city: true,
    state: true,
    zip: true,
    country: true,
  },
  projectDocuments: {
    id: true,
    description: true,
    infoUrl: true,
    title: true,
    enrollmentDocuments: {
      id: true,
    },
  },
  questions: {
    id: true,
    text: true,
    answers: {
      id: true,
      answer: true,
    },
  },
});
