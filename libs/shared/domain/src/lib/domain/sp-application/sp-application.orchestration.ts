import { IOperation } from '@orcha/common';
import {
  ProcessSpApplicationDto,
  SubmitSpApplicationDto,
  WithdrawSpApplicationDto,
} from './sp-application.dtos';
import { SpApplication } from './sp-application.model';

export interface ISpApplicationOrchestration {
  submit: IOperation<SpApplication, SubmitSpApplicationDto>;
  process: IOperation<{ deletedId: string }, ProcessSpApplicationDto>;
  findAll: IOperation<SpApplication[]>;
  withdraw: IOperation<{ deletedId: string }, WithdrawSpApplicationDto>;
}
