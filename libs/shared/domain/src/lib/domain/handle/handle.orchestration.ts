import { IOperation } from '@orcha/common';
import { GenericHandleSearchDto, SearchHandleDto, VerifyHandleDto, ViewProfileDto } from './handle.dtos';
import { Handle } from './handle.model';

export interface IHandleOrchestration {
  verifyHandle: IOperation<{ isUnique: boolean }, VerifyHandleDto>;
  searchHandles: IOperation<Handle[], SearchHandleDto>;
  viewProfile: IOperation<Handle, ViewProfileDto>;
  genericSearch: IOperation<Handle[], GenericHandleSearchDto>;
}
