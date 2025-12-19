import { createQuery } from '../repository';
import { Poi } from './poi.model';

export const PoiCmQuery = createQuery<Poi[]>()({
  id: true,
  dateCreated: true,
  dateStarted: true,
  dateStopped: true,
  dateApproved: true,
  dateDenied: true,
  dateSubmitted: true,
  imagesFilePaths: true,
  latitude: true,
  longitude: true,
  pausedTimes: true,
  resumedTimes: true,
  answers: {
    id: true,
    answer: true,
    dateAnswered: true,
    question: {
      id: true,
      text: true,
    },
  },
  enrollment: {
    id: true,
    project: {
      id: true,
      title: true,
      imagesFilePaths: true,
      requireImages: true,
      description: true,
      creditsEarned: true,
      questions: {
        id: true,
        text: true,
      },
      address: {
        state: true,
        city: true,
      },
    },
  },
  __paginate: {
    page: 1,
    limit: 100,
  },
});

export const PoiSpQuery = createQuery<Poi>()({
  id: true,
  dateCreated: true,
  dateStarted: true,
  dateApproved: true,
  dateStopped: true,
  dateDenied: true,
  dateSubmitted: true,
  imagesFilePaths: true,
  latitude: true,
  longitude: true,
  pausedTimes: true,
  resumedTimes: true,
  answers: {
    id: true,
    answer: true,
    dateAnswered: true,
    question: {
      id: true,
      text: true,
    },
  },
  enrollment: {
    id: true,
    project: {
      id: true,
      title: true,
      imagesFilePaths: true,
      requireImages: true,
      questions: {
        id: true,
        text: true,
      },
    },
    changeMaker: {
      id: true,
      profilePicFilePath: true,
      firstName: true,
      lastName: true,
      handle: {
        id: true,
      },
    },
  },
});
