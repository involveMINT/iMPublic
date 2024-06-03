import { ServeAdminRepository } from '@involvemint/server/core/domain-services';
import { IExactQuery, IQuery, ServeAdmin } from '@involvemint/shared/domain';
import * as uuid from 'uuid';

export function createServeAdmin<Q extends IQuery<ServeAdmin>>(
  query: IExactQuery<ServeAdmin, Q>,
  saRepo: ServeAdminRepository,
  userId: string,
  servePartnerId: string
) {
  return saRepo.upsert(
    {
      id: uuid.v4(),
      datePermitted: new Date(),
      servePartner: servePartnerId,
      superAdmin: true,
      user: userId,
    },
    query
  );
}
