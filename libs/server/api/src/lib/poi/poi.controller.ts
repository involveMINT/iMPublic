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
  Query,
  ResumePoiTimerDto,
  QUERY_KEY,
  PoiCmQuery,
  TOKEN_KEY,
  DTO_KEY,
  FILES_KEY,
  PoiSpQuery
} from '@involvemint/shared/domain';
import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    UploadedFiles,
    Headers
  } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { QueryValidationPipe, ValidationPipe } from '../pipes';

@Controller(InvolvemintRoutes.poi)
export class PoiController {
    constructor(private readonly poiService: PoiService) {}

  @Post('get')
  get(
    @Body(QUERY_KEY, new QueryValidationPipe(PoiCmQuery)) query: Query<Poi[]>, 
    @Headers(TOKEN_KEY) token: string 
  ){
      return this.poiService.get(query, token);
  }

  @Post('create')
  create(
    @Body(QUERY_KEY, new QueryValidationPipe(PoiCmQuery)) query: Query<Poi>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: CreatePoiDto
  ) {
      return this.poiService.create(query, token, dto);
  }

  @Post('start')
  start(
    @Body(QUERY_KEY, new QueryValidationPipe(PoiCmQuery)) query: Query<Poi>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: StartPoiTimerDto
  ) {
    return this.poiService.start(query, token, dto);
  }

  @Post('stop')
  stop(
    @Body(QUERY_KEY, new QueryValidationPipe(PoiCmQuery)) query: Query<Poi>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: StopPoiTimerDto
  ) {
    return this.poiService.stop(query, token, dto);
  }

  @Post('withdraw')
  withdraw(
    @Body(QUERY_KEY, new QueryValidationPipe({ deletedId: true })) query: Query<{ deletedId: string }>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: WithdrawPoiDto
    ) {
    return this.poiService.withdraw(query, token, dto);
  }

  @Post('pause')
  pause(
    @Body(QUERY_KEY, new QueryValidationPipe(PoiCmQuery)) query: Query<Poi>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: PausePoiTimerDto
  ) {
    return this.poiService.pause(query, token, dto);
  }

  @Post('resume')
  resume(
    @Body(QUERY_KEY, new QueryValidationPipe(PoiCmQuery)) query: Query<Poi>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: ResumePoiTimerDto
  ) {
    return this.poiService.resume(query, token, dto);
  }

  @Post('submit')
  @UseInterceptors(FilesInterceptor(FILES_KEY))
  submit(
    @Body(QUERY_KEY, new QueryValidationPipe(PoiCmQuery)) query: Query<Poi>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: SubmitPoiDto, 
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.poiService.submit(query, token, dto, files);
  }

  /*
      ___                  ___          _                
     / __| ___ _ ___ _____| _ \__ _ _ _| |_ _ _  ___ _ _ 
     \__ \/ -_) '_\ V / -_)  _/ _` | '_|  _| ' \/ -_) '_|
     |___/\___|_|  \_/\___|_| \__,_|_|  \__|_||_\___|_|  
                                                         
  */

  @Post('getByProject')
  getByProject(
    @Body(QUERY_KEY, new QueryValidationPipe(PoiSpQuery)) query: Query<Poi[]>, 
    @Headers(TOKEN_KEY) token: string,
    @Body(DTO_KEY, new ValidationPipe()) dto: GetPoisByProjectDto
  ) {
    return this.poiService.getByProject(query, token, dto);
  }

  @Post('approve')
  approve(
    @Body() body: { query: Query<Poi>, token: string, dto: ApprovePoiDto },
    @Headers(TOKEN_KEY) token: string
  ) {
    return this.poiService.approve(body.query, token, body.dto);
  }

  @Post('deny')
  deny(
    @Body(QUERY_KEY, new QueryValidationPipe(PoiSpQuery)) query: Query<Poi>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: DenyPoiDto
  ) {
    return this.poiService.deny(query, token, dto);
  }
}
