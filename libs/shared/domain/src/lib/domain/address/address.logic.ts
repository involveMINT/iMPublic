import { createLogic } from '../repository';
import { Address } from './address.model';
import * as uuid from 'uuid';
import { environment } from '../../environments';

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

export function getDefaultAddress(): 
  {
    id: string;
    address1: string;
    address2: string | undefined;
    city: string;
    state: string;
    zip: string;
  }
  {
    const defaultAddress = environment.defaultLocalAddress[0];

    const address = {
        id: uuid.v4(),
        address1: `${defaultAddress.streetNumber} ${defaultAddress.streetName}`,
        address2: undefined,
        city: defaultAddress.city ?? '',
        state: defaultAddress.administrativeLevels?.level1long ?? 'PA',
        zip: defaultAddress.zipcode ?? '',
      };

    return address;
  }
