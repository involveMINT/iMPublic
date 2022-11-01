import { createLogic } from '@orcha/common';
import { Address } from './address.model';

export const formatImAddress = createLogic<
  Address,
  {
    address1: true;
    address2: true;
    address3: true;
    city: true;
    state: true;
    zip: true;
  }
>()(
  ({ address1, address2, address3, city, state, zip }) =>
    `${address1 ?? ''} ${address2 ?? ''} ${address3 ?? ''} ${city ?? ''}, ${state ?? ''} ${zip ?? ''}`
);

export const formatImPublicAddress = createLogic<
  Address,
  {
    city: true;
    state: true;
  }
>()(({ city, state }) => `${city ?? ''}, ${state ?? ''}`);
