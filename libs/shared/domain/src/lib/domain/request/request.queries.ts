import { createQuery } from '../repository';
import { Request } from './request.model';

export const RequestQuery = createQuery<Request>()({
  id: true,
  name: true,
  priceStatus: true,
  price: true,
  description: true,
  listingStatus: true,
  dateCreated: true,
  dateUpdated: true,
  imagesFilePaths: true,
  changeMaker: { id: true, profilePicFilePath: true, handle: { id: true } },
  exchangePartner: { id: true, logoFilePath: true, handle: { id: true } },
  servePartner: { id: true, logoFilePath: true, handle: { id: true } },
});

export const RequestMarketQuery = createQuery<Request[]>()({
  id: true,
  name: true,
  priceStatus: true,
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

export const ViewProfileInfoRequestQuery = createQuery<Request[]>()({
  listingStatus: true,
});
