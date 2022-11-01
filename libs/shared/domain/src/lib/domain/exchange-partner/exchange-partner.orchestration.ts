import { IOperation } from '@orcha/common';
import {
  DeleteEpImageDto,
  EditEpProfileDto,
  ExchangePartnerMarketQueryDto,
  GetOneExchangePartnerDto,
  SearchEpDto,
  UpdateEpLogoFileDto,
  UploadEpImagesDto,
} from './exchange-partner.dtos';
import { ExchangePartner } from './exchange-partner.model';

export interface IExchangePartnerOrchestration {
  query: IOperation<ExchangePartner[], ExchangePartnerMarketQueryDto>;
  getOne: IOperation<ExchangePartner, GetOneExchangePartnerDto>;
  searchEps: IOperation<ExchangePartner[], SearchEpDto>;
  editProfile: IOperation<ExchangePartner, EditEpProfileDto>;
  updateLogoFile: IOperation<ExchangePartner, UpdateEpLogoFileDto, File>;
  uploadImages: IOperation<ExchangePartner, UploadEpImagesDto, File[]>;
  deleteImage: IOperation<ExchangePartner, DeleteEpImageDto>;
}
