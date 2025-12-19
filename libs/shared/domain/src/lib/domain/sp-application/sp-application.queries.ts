import { createQuery } from '../repository';
import { SpApplication } from './sp-application.model';

export const SpApplicationQuery = createQuery<SpApplication>()({
  id: true,
  address: {
    address1: true,
    city: true,
    address2: true,
    state: true,
    zip: true,
  },
  email: true,
  handle: { id: true },
  name: true,
  phone: true,
  website: true,
  user: {
    id: true,
  },
});
