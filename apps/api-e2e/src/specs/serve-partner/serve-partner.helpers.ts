import { ServePartnerRepository } from '@involvemint/server/core/domain-services';
import { ServePartner } from '@involvemint/shared/domain';
import { IExactQuery, IQuery } from '@orcha/common';
import * as uuid from 'uuid';

export function createServePartner<Q extends IQuery<ServePartner>>(
  query: IExactQuery<ServePartner, Q>,
  spRepo: ServePartnerRepository,
  dto: { id: string; handle: string }
) {
  return spRepo.upsert(
    {
      id: dto.id,
      admins: [],
      credits: [],
      dateCreated: new Date(),
      email: '',
      handle: { id: dto.handle },
      imagesFilePaths: [],
      name: '',
      offers: [],
      phone: '',
      projects: [],
      receivingTransactions: [],
      receivingVouchers: [],
      requests: [],
      sendingTransactions: [],
      website: '',
      address: {
        id: uuid.v4(),
        address1: '',
        city: '',
        state: '',
        zip: '',
      },
    },
    query
  );
}
