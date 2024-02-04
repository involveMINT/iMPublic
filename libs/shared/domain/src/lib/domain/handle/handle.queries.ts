import { createQuery } from '../repository';
import { Handle } from './handle.model';

export const HandleQuery = createQuery<Handle>()({
  id: true,
  changeMaker: {},
  servePartner: {},
  exchangePartner: {},
});

export const HandleChatQuery = createQuery<Handle>()({
  id: true,
  changeMaker: {},
  exchangePartner: {},
  servePartner: {},
});

export const ViewProfileInfoQuery = createQuery<Handle>()({
  id: true,
  changeMaker: {
    id: true,
    firstName: true,
    lastName: true,
    bio: true,
    dateCreated: true,
    offers: {
      listingStatus: true,
    },
    requests: {
      listingStatus: true,
    },
    view: {
      poiApproved: true,
      secondsCompleted: true,
      spentCredits: true,
      earnedCredits: true,
    },
    profilePicFilePath: true,
    address: {
      city: true,
      state: true,
    },
    enrollments: {
      id: true,
      dateApplied: true,
      dateApproved: true,
      dateDenied: true,
      dateRetired: true,
      dateSubmitted: true,
      project: {
        id: true,
        title: true,
        imagesFilePaths: true,
        description: true,
        address: {
          city: true,
          state: true,
        },
      },
      pois: {
        imagesFilePaths: true,
        dateStarted: true,
        dateStopped: true,
        dateSubmitted: true,
        dateApproved: true,
        dateDenied: true,
        pausedTimes: true,
        resumedTimes: true,
      },
    },
  },
  servePartner: {
    id: true,
    dateCreated: true,
    email: true,
    logoFilePath: true,
    latitude: true,
    longitude: true,
    description: true,
    name: true,
    phone: true,
    imagesFilePaths: true,
    website: true,
    projects: {},
    address: {
      city: true,
      state: true,
    },
    offers: {
      listingStatus: true,
    },
    requests: {
      listingStatus: true,
    },
  },
  exchangePartner: {
    id: true,
    budget: true,
    view: { receivedThisMonth: true },
    dateCreated: true,
    longitude: true,
    latitude: true,
    email: true,
    description: true,
    name: true,
    phone: true,
    imagesFilePaths: true,
    logoFilePath: true,
    website: true,
    address: {
      city: true,
      state: true,
    },
    offers: {
      listingStatus: true,
    },
    requests: {
      listingStatus: true,
    },
  },
});

export const GenericHandleSearchQuery = createQuery<Handle[]>()({
  id: true,
  changeMaker: {
    firstName: true,
    lastName: true,
    user: {
      id: true,
    },
  },
  servePartner: {
    id: true,
    name: true,
    email: true,
  },
  exchangePartner: {
    id: true,
    name: true,
    email: true,
  },
});
