import { createQuery } from '../repository';
import { ExchangeAdmin } from './exchange-admin.model';

export const EpAdminQuery = createQuery<ExchangeAdmin[]>()({
  id: true,
  superAdmin: true,
  datePermitted: true,
  exchangePartner: { id: true },
  user: {
    id: true,
    changeMaker: { handle: { id: true }, profilePicFilePath: true, firstName: true, lastName: true },
  },
});

export const BaDownloadEpAdminsQuery = createQuery<ExchangeAdmin[]>()({
  id: true,
  exchangePartner: {
    id: true,
    handle: {
      id: true,
    },
    onboardingState: true,
    name: true,
    description: true,
    logoFilePath: true,
    website: true,
    address: {
      id: true,
      address1: true,
      city: true,
      state: true,
      zip: true,
      country: true,
    },
    phone: true,
    email: true,
    ein: true,
    imagesFilePaths: true,
    budget: true,
    budgetEndDate: true,
    listStoreFront: true,
    view: {
      receivedThisMonth: true,
    },
  },
});
