import { IOperation } from '@orcha/common';
import {
  CreateOfferDto,
  DeleteOfferDto,
  DeleteOfferImageDto,
  GetOffersForProfileDto,
  GetOneOfferDto,
  QueryOffersDto,
  UpdateOfferDto,
  UploadOfferImageDto,
} from './offer.dtos';
import { Offer } from './offer.model';

export interface IOfferOrchestration {
  query: IOperation<Offer[], QueryOffersDto>;
  getOne: IOperation<Offer, GetOneOfferDto>;
  getForProfile: IOperation<Offer[], GetOffersForProfileDto>;
  create: IOperation<Offer, CreateOfferDto>;
  update: IOperation<Offer, UpdateOfferDto>;
  delete: IOperation<{ deletedId: string }, DeleteOfferDto>;
  uploadImages: IOperation<Offer, UploadOfferImageDto, File[]>;
  deleteImage: IOperation<Offer, DeleteOfferImageDto>;
}
