import { IOperation } from '@orcha/common';
import {
  DeletePassportDocumentDto,
  EditPassportDocumentDto,
  ReplacePassportDocumentDto,
} from './passport-document.dtos';
import { PassportDocument } from './passport-document.model';

export interface IPassportDocumentOrchestration {
  get: IOperation<PassportDocument[]>;
  create: IOperation<PassportDocument, undefined, File>;
  edit: IOperation<PassportDocument, EditPassportDocumentDto>;
  replace: IOperation<PassportDocument, ReplacePassportDocumentDto, File>;
  delete: IOperation<{ deletedId: string }, DeletePassportDocumentDto>;
}
