import { HandleService } from '@involvemint/server/core/application-services';
import {
  GenericHandleSearchDto,
  GenericHandleSearchQuery,
  Handle,
  HandleChatQuery,
  IHandleOrchestration,
  InvolvemintRoutes,
  SearchHandleDto,
  VerifyHandleDto,
  VerifyHandleQuery,
  ViewProfileDto,
  ViewProfileInfoQuery,
} from '@involvemint/shared/domain';
import { IQuery, parseQuery } from '@orcha/common';
import { IServerOrchestration, ServerOperation, ServerOrchestration } from '@orcha/nestjs';

@ServerOrchestration(InvolvemintRoutes.handle)
export class HandleOrchestration implements IServerOrchestration<IHandleOrchestration> {
  constructor(private readonly handle: HandleService) {}

  @ServerOperation({ validateQuery: VerifyHandleQuery })
  async verifyHandle(query: IQuery<{ isUnique: boolean }>, _: string, { handle }: VerifyHandleDto) {
    return parseQuery(query, { isUnique: await this.handle.verifyHandle(handle) });
  }

  @ServerOperation({ validateQuery: HandleChatQuery })
  async searchHandles(query: IQuery<Handle[]>, _: string, dto: SearchHandleDto) {
    return this.handle.searchHandles(query, dto);
  }

  @ServerOperation({ validateQuery: ViewProfileInfoQuery })
  async viewProfile(query: IQuery<Handle[]>, _: string, dto: ViewProfileDto) {
    return this.handle.viewProfile(query, dto);
  }

  @ServerOperation({ validateQuery: GenericHandleSearchQuery })
  async genericSearch(query: IQuery<Handle[]>, _: string, dto: GenericHandleSearchDto) {
    return this.handle.genericSearch(query, dto);
  }
}
