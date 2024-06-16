import { createQuery } from '../repository';
import { ExchangePartner } from '../exchange-partner';
import { EpApplication } from './ep-application.model';

export const EpApplicationQuery = createQuery<EpApplication>()({
  id: true,
  address: {
    address1: true,
    address2: true,
    city: true,
    state: true,
    zip: true,
  },
  email: true,
  handle: { id: true },
  name: true,
  phone: true,
  website: true,
  ein: true,
  user: {
    id: true,
  },
});

export const BaSubmitEpApplicationQuery = createQuery<ExchangePartner>()({
  id: true,
  name: true,
});
