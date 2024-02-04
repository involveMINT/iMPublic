import { StorageService } from '@involvemint/server/core/application-services';
import {
  GetStorageFileDto,
  InvolvemintRoutes,
  IStorageOrchestration,
} from '@involvemint/shared/domain';
import { IQuery, parseQuery } from '@orcha/common';
import { IServerOrchestration, ServerOperation, ServerOrchestration } from '@orcha/nestjs';

@ServerOrchestration(InvolvemintRoutes.storage)
export class StorageOrchestration implements IServerOrchestration<IStorageOrchestration> {
  constructor(private readonly storage: StorageService) {}

  @ServerOperation({ validateQuery: { url: true } })
  async getUrl(query: IQuery<{ url: string }>, token: string, { path }: GetStorageFileDto) {
    const url = await this.storage.authenticateFileRequest(path, token);
    return parseQuery(query, { url });
  }
}
