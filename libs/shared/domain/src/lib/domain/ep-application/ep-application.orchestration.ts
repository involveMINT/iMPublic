import { IOperation } from '@orcha/common';
import { ExchangePartner } from '../exchange-partner';
import {
  BaSubmitEpApplicationDto,
  ProcessEpApplicationDto,
  SubmitEpApplicationDto,
  WithdrawEpApplicationDto,
} from './ep-application.dtos';
import { EpApplication } from './ep-application.model';

export interface IEpApplicationOrchestration {
  submit: IOperation<EpApplication, SubmitEpApplicationDto>;
  baSubmit: IOperation<ExchangePartner, BaSubmitEpApplicationDto>;
  process: IOperation<{ deletedId: string }, ProcessEpApplicationDto>;
  findAll: IOperation<EpApplication[]>;
  withdraw: IOperation<{ deletedId: string }, WithdrawEpApplicationDto>;
}
