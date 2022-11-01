import { IOperation } from '@orcha/common';
import {
  CreateRequestDto,
  DeleteRequestDto,
  DeleteRequestImageDto,
  GetOneRequestDto,
  GetRequestsForProfileDto,
  QueryRequestsDto,
  UpdateRequestDto,
  UploadRequestImageDto,
} from './request.dtos';
import { Request } from './request.model';

export interface IRequestOrchestration {
  query: IOperation<Request[], QueryRequestsDto>;
  getOne: IOperation<Request, GetOneRequestDto>;
  getForProfile: IOperation<Request[], GetRequestsForProfileDto>;
  create: IOperation<Request, CreateRequestDto>;
  update: IOperation<Request, UpdateRequestDto>;
  delete: IOperation<{ deletedId: string }, DeleteRequestDto>;
  uploadImages: IOperation<Request, UploadRequestImageDto, File[]>;
  deleteImage: IOperation<Request, DeleteRequestImageDto>;
}
