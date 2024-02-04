import { PoiService } from '@involvemint/server/core/application-services';
import {
  ApprovePoiDto,
  CreatePoiDto,
  DenyPoiDto,
  GetPoisByProjectDto,
  InvolvemintRoutes,
  IPoiOrchestration,
  PausePoiTimerDto,
  Poi,
  PoiCmQuery,
  PoiSpQuery,
  ResumePoiTimerDto,
  StartPoiTimerDto,
  StopPoiTimerDto,
  SubmitPoiDto,
  WithdrawPoiDto,
} from '@involvemint/shared/domain';
import { IQuery } from '@orcha/common';
import { IServerOrchestration, ServerOperation, ServerOrchestration } from '@orcha/nestjs';

@ServerOrchestration(InvolvemintRoutes.poi)
export class PoiOrchestration implements IServerOrchestration<IPoiOrchestration> {
  constructor(private readonly poiService: PoiService) {}

  /*
       ___ _                       __  __      _           
      / __| |_  __ _ _ _  __ _ ___|  \/  |__ _| |_____ _ _ 
     | (__| ' \/ _` | ' \/ _` / -_) |\/| / _` | / / -_) '_|
      \___|_||_\__,_|_||_\__, \___|_|  |_\__,_|_\_\___|_|  
                         |___/                             
  */

  @ServerOperation({ validateQuery: PoiCmQuery })
  get(query: IQuery<Poi[]>, token: string) {
    return this.poiService.get(query, token);
  }

  @ServerOperation({ validateQuery: PoiCmQuery })
  create(query: IQuery<Poi>, token: string, dto: CreatePoiDto) {
    return this.poiService.create(query, token, dto);
  }

  @ServerOperation({ validateQuery: PoiCmQuery })
  start(query: IQuery<Poi>, token: string, dto: StartPoiTimerDto) {
    return this.poiService.start(query, token, dto);
  }

  @ServerOperation({ validateQuery: PoiCmQuery })
  stop(query: IQuery<Poi>, token: string, dto: StopPoiTimerDto) {
    return this.poiService.stop(query, token, dto);
  }

  @ServerOperation({ validateQuery: { deletedId: true } })
  withdraw(query: IQuery<{ deletedId: string }>, token: string, dto: WithdrawPoiDto) {
    return this.poiService.withdraw(query, token, dto);
  }

  @ServerOperation({ validateQuery: PoiCmQuery })
  pause(query: IQuery<Poi>, token: string, dto: PausePoiTimerDto) {
    return this.poiService.pause(query, token, dto);
  }

  @ServerOperation({ validateQuery: PoiCmQuery })
  resume(query: IQuery<Poi>, token: string, dto: ResumePoiTimerDto) {
    return this.poiService.resume(query, token, dto);
  }

  @ServerOperation({ validateQuery: PoiCmQuery, fileUpload: 'multiple' })
  submit(query: IQuery<Poi>, token: string, dto: SubmitPoiDto, files: Express.Multer.File[]) {
    return this.poiService.submit(query, token, dto, files);
  }

  /*
      ___                  ___          _                
     / __| ___ _ ___ _____| _ \__ _ _ _| |_ _ _  ___ _ _ 
     \__ \/ -_) '_\ V / -_)  _/ _` | '_|  _| ' \/ -_) '_|
     |___/\___|_|  \_/\___|_| \__,_|_|  \__|_||_\___|_|  
                                                         
  */

  @ServerOperation({ validateQuery: PoiSpQuery })
  getByProject(query: IQuery<Poi[]>, token: string, dto: GetPoisByProjectDto) {
    return this.poiService.getByProject(query, token, dto);
  }

  @ServerOperation({ validateQuery: PoiSpQuery })
  approve(query: IQuery<Poi>, token: string, dto: ApprovePoiDto) {
    return this.poiService.approve(query, token, dto);
  }

  @ServerOperation({ validateQuery: PoiSpQuery })
  deny(query: IQuery<Poi>, token: string, dto: DenyPoiDto) {
    return this.poiService.deny(query, token, dto);
  }
}
