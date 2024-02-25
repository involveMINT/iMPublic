import { PoiService } from '@involvemint/server/core/application-services';
import {
  ApprovePoiDto,
  CreatePoiDto,
  DenyPoiDto,
  GetPoisByProjectDto,
  Poi,
  PausePoiTimerDto,
  StartPoiTimerDto,
  StopPoiTimerDto,
  SubmitPoiDto,
  WithdrawPoiDto,
  InvolvemintRoutes,
  IQuery,
  ResumePoiTimerDto,
} from '@involvemint/shared/domain';
import {
    Controller,
    Post,
    Body
  } from '@nestjs/common';

@Controller(InvolvemintRoutes.poi)
export class PoiController {
    constructor(private readonly poiService: PoiService) {}

  @Post('get')
  get(@Body() body: { query: IQuery<Poi[]>, token: string }) {
      return this.poiService.get(body.query, body.token);
  }

  @Post('create')
  create(@Body() body: { query: IQuery<Poi>, token: string, dto: CreatePoiDto }) {
    return this.poiService.create(body.query, body.token, body.dto);
  }

  @Post('start')
  start(@Body() body: { query: IQuery<Poi>, token: string, dto: StartPoiTimerDto }) {
    return this.poiService.start(body.query, body.token, body.dto);
  }

  @Post('stop')
  stop(@Body() body: { query: IQuery<Poi>, token: string, dto: StopPoiTimerDto }) {
    return this.poiService.stop(body.query, body.token, body.dto);
  }

  @Post('withdraw')
  withdraw(@Body() body: { query: IQuery<{ deletedId: string }>, token: string, dto: WithdrawPoiDto }) {
    return this.poiService.withdraw(body.query, body.token, body.dto);
  }

  @Post('pause')
  pause(@Body() body: { query: IQuery<Poi>, token: string, dto: PausePoiTimerDto }) {
    return this.poiService.pause(body.query, body.token, body.dto);
  }

  @Post('resume')
  resume(@Body() body: { query: IQuery<Poi>, token: string, dto: ResumePoiTimerDto }) {
    return this.poiService.resume(body.query, body.token, body.dto);
  }

  @Post('submit')
  submit(@Body() body: { query: IQuery<Poi>, token: string, dto: SubmitPoiDto, files: Express.Multer.File[] }) {
    return this.poiService.submit(body.query, body.token, body.dto, body.files);
  }

  @Post('getByProject')
  getByProject(@Body() body: { query: IQuery<Poi[]>, token: string, dto: GetPoisByProjectDto }) {
    return this.poiService.getByProject(body.query, body.token, body.dto);
  }

  @Post('approve')
  approve(@Body() body: { query: IQuery<Poi>, token: string, dto: ApprovePoiDto }) {
    return this.poiService.approve(body.query, body.token, body.dto);
  }

  @Post('deny')
  deny(@Body() body: { query: IQuery<Poi>, token: string, dto: DenyPoiDto }) {
    return this.poiService.deny(body.query, body.token, body.dto);
  }
}
