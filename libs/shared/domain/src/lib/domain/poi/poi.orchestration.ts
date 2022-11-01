import { IOperation } from '@orcha/common';
import {
  ApprovePoiDto,
  CreatePoiDto,
  DenyPoiDto,
  GetPoisByProjectDto,
  PausePoiTimerDto,
  ResumePoiTimerDto,
  StartPoiTimerDto,
  StopPoiTimerDto,
  SubmitPoiDto,
  WithdrawPoiDto,
} from './poi.dtos';
import { Poi } from './poi.model';

export interface IPoiOrchestration {
  get: IOperation<Poi[]>;
  getByProject: IOperation<Poi[], GetPoisByProjectDto>;
  create: IOperation<Poi, CreatePoiDto>;
  withdraw: IOperation<{ deletedId: string }, WithdrawPoiDto>;
  start: IOperation<Poi, StartPoiTimerDto>;
  stop: IOperation<Poi, StopPoiTimerDto>;
  pause: IOperation<Poi, PausePoiTimerDto>;
  resume: IOperation<Poi, ResumePoiTimerDto>;
  submit: IOperation<Poi, SubmitPoiDto, File[]>;
  approve: IOperation<Poi, ApprovePoiDto>;
  deny: IOperation<Poi, DenyPoiDto>;
}
