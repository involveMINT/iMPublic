import { createQuery } from '../repository';
import { Offer } from './offer.model';

export const OfferQuery = createQuery<Offer>()({
  id: true,
  name: true,
  price: true,
  description: true,
  listingStatus: true,
  dateCreated: true,
  dateUpdated: true,
  imagesFilePaths: true,
  changeMaker: { id: true },
  exchangePartner: { id: true },
  servePartner: { id: true },
});

export const OfferMarketQuery = createQuery<Offer[]>()({
  id: true,
  name: true,
  price: true,
  description: true,
  listingStatus: true,
  dateCreated: true,
  dateUpdated: true,
  imagesFilePaths: true,
  changeMaker: { id: true, profilePicFilePath: true, handle: { id: true } },
  exchangePartner: { id: true, logoFilePath: true, handle: { id: true } },
  servePartner: { id: true, logoFilePath: true, handle: { id: true } },
  __paginate: {
    limit: 100,
    page: 1,
  },
});

export const ViewProfileInfoOfferQuery = createQuery<Offer[]>()({
  listingStatus: true,
});
