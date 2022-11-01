import { ServeAdminRepository } from '@involvemint/server/core/domain-services';
import { ServeAdmin } from '@involvemint/shared/domain';
import { IExactQuery, IQuery } from '@orcha/common';
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
