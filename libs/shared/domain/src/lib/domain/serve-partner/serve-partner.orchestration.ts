import { IOperation } from '@orcha/common';
import {
  DeleteSpImageDto,
  EditSpProfileDto,
  UpdateSpLogoFileDto,
  UploadSpImagesDto,
} from './serve-partner.dtos';
import { ServePartner } from './serve-partner.model';

export interface IServePartnerOrchestration {
  editProfile: IOperation<ServePartner, EditSpProfileDto>;
  updateLogoFile: IOperation<ServePartner, UpdateSpLogoFileDto, File>;
  uploadImages: IOperation<ServePartner, UploadSpImagesDto, File[]>;
  deleteImage: IOperation<ServePartner, DeleteSpImageDto>;
}
