import { RequestService } from '@involvemint/server/core/application-services';
import {
  CreateRequestDto,
  DeleteRequestDto,
  DeleteRequestImageDto,
  GetOneRequestDto,
  GetRequestsForProfileDto,
  InvolvemintOrchestrations,
  IRequestOrchestration,
  QueryRequestsDto,
  Request,
  RequestMarketQuery,
  RequestQuery,
  UpdateRequestDto,
  UploadRequestImageDto,
} from '@involvemint/shared/domain';
import { IQuery } from '@orcha/common';
import { IServerOrchestration, ServerOperation, ServerOrchestration } from '@orcha/nestjs';

@ServerOrchestration(InvolvemintOrchestrations.request)
export class RequestOrchestration implements IServerOrchestration<IRequestOrchestration> {
  constructor(private readonly request: RequestService) {}

  @ServerOperation({ validateQuery: RequestMarketQuery })
  query(query: IQuery<Request[]>, _: string, dto: QueryRequestsDto) {
    return this.request.query(query, dto);
  }

  @ServerOperation({ validateQuery: RequestQuery })
  getOne(query: IQuery<Request>, _: string, dto: GetOneRequestDto) {
    return this.request.getOne(query, dto);
  }

  @ServerOperation({ validateQuery: RequestQuery })
  getForProfile(query: IQuery<Request[]>, token: string, dto: GetRequestsForProfileDto) {
    return this.request.getForProfile(query, token, dto);
  }

  @ServerOperation({ validateQuery: RequestQuery })
  create(query: IQuery<Request>, token: string, dto: CreateRequestDto) {
    return this.request.create(query, token, dto);
  }

  @ServerOperation({ validateQuery: RequestQuery })
  update(query: IQuery<Request>, token: string, dto: UpdateRequestDto) {
    return this.request.update(query, token, dto);
  }

  @ServerOperation({ validateQuery: { deletedId: true } })
  delete(query: IQuery<{ deletedId: string }>, token: string, dto: DeleteRequestDto) {
    return this.request.delete(query, token, dto);
  }

  @ServerOperation({ validateQuery: RequestQuery, fileUpload: 'multiple' })
  uploadImages(
    query: IQuery<Request>,
    token: string,
    dto: UploadRequestImageDto,
    files: Express.Multer.File[]
  ) {
    return this.request.uploadImages(query, token, dto, files);
  }

  @ServerOperation({ validateQuery: RequestQuery })
  deleteImage(query: IQuery<Request>, token: string, dto: DeleteRequestImageDto) {
    return this.request.deleteImage(query, token, dto);
  }
}
