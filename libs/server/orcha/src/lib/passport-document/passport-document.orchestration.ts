import { PassportService } from '@involvemint/server/core/application-services';
import {
  DeletePassportDocumentDto,
  DeletePassportDocumentQuery,
  EditPassportDocumentDto,
  InvolvemintRoutes,
  IPassportDocumentOrchestration,
  PassportDocument,
  PassportDocumentQuery,
  ReplacePassportDocumentDto,
} from '@involvemint/shared/domain';
import { IQuery } from '@orcha/common';
import { IServerOrchestration, ServerOperation, ServerOrchestration } from '@orcha/nestjs';

@ServerOrchestration(InvolvemintRoutes.passport)
export class PassportDocumentOrchestration implements IServerOrchestration<IPassportDocumentOrchestration> {
  constructor(private readonly passport: PassportService) {}

  @ServerOperation({ validateQuery: PassportDocumentQuery })
  get(query: IQuery<PassportDocument[]>, token: string) {
    return this.passport.get(query, token);
  }

  @ServerOperation({ validateQuery: PassportDocumentQuery })
  create(query: IQuery<PassportDocument>, token: string, _: undefined, file: Express.Multer.File) {
    return this.passport.create(query, token, file);
  }

  @ServerOperation({ validateQuery: PassportDocumentQuery })
  edit(query: IQuery<PassportDocument>, token: string, dto: EditPassportDocumentDto) {
    return this.passport.edit(query, token, dto);
  }

  @ServerOperation({ validateQuery: PassportDocumentQuery })
  replace(
    query: IQuery<PassportDocument>,
    token: string,
    dto: ReplacePassportDocumentDto,
    file: Express.Multer.File
  ) {
    return this.passport.replace(query, token, dto, file);
  }

  @ServerOperation({ validateQuery: DeletePassportDocumentQuery })
  delete(query: IQuery<{ deletedId: string }>, token: string, dto: DeletePassportDocumentDto) {
    return this.passport.delete(query, token, dto);
  }
}
