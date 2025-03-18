import { createQuery } from '../repository';
import { ExchangePartner } from './exchange-partner.model';

export const ExchangePartnerSearchQuery = createQuery<ExchangePartner>()({
  id: true,
  name: true,
  email: true,
  handle: {
    id: true,
  },
  admins: {
    user: {
      id: true,
    },
  },
});

export const ExchangePartnerMarketQuery = createQuery<ExchangePartner[]>()({
  id: true,
  name: true,
  logoFilePath: true,
  imagesFilePaths: true,
  budget: true,
  budgetEndDate: true,
  handle: {
    id: true,
  },
  latitude: true,
  longitude: true,
  address: {
    id: true,
    address1: true,
    address2: true,
    address3: true,
    country: true,
    zip: true,
    city: true,
    state: true,
  },
  view: {
    receivedThisMonth: true,
  },
  offers: {
    id: true,
    name: true,
    price: true,
    description: true,
    listingStatus: true,
    dateCreated: true,
    dateUpdated: true,
    imagesFilePaths: true,
    changeMaker: { id: true, profilePicFilePath: true, handle: { id: true } },
    servePartner: { id: true, logoFilePath: true, handle: { id: true } },
  },
  requests: {
    id: true,
    name: true,
    priceStatus: true,
    price: true,
    description: true,
    listingStatus: true,
    dateCreated: true,
    dateUpdated: true,
    imagesFilePaths: true,
  },
});

export const BaDownloadEpIdsWithEmailQuery = createQuery<ExchangePartner[]>()({
  id: true,
  admins: {
    id: true,
  },
});
