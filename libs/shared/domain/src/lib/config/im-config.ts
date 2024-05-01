/* eslint-disable no-useless-escape */
/* eslint-disable no-control-regex */
import { convertDeepReadonly } from '@involvemint/shared/util';
import { addMinutes } from 'date-fns';
import { CurrencyMaskConfig } from 'ng2-currency-mask';

export const ImConfig = convertDeepReadonly({
  creditsPerHour: 1500,
  maxCreditTransactionAmount: 5000000,
  maxProjectDocuments: 5,
  maxProjectQuestions: 5,
  startingSpBudget: 20000,
  walletHeight: '70vh',
  adminEmail: 'admin@admin.com',
  maxNeedLength: 15,
  maxImagesPerItem: 40,
  maxDescriptionLength: 500,
  maxTitleLength: 60,
  browseProjectsPaginateItemsLoad: 30,
  marketPaginateItemsLoad: 30,
  formDebounceTime: 500,
  maxTCPerDay: 12000,
  requireApplicationApproval: false,
  storageExpiration: () => addMinutes(new Date(), 120),
  regex: {
    password: {
      regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      text: `Your password must be minimum 8 characters, contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.`,
    },
    firstName: /^[a-zA-Z ]+$/, // can contain multiple names
    lastName: /^[a-zA-Z ]+$/, // can contain multiple names
    handle: /^([\-\w]){4,25}$/, // minimum 4 characters
    bio: /^.{0,100}$/, // can be empty but max of 100 characters
    email: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    phone: /^(\([2-9]\d{2}\))\s\d{3}-\d{4}$/,
    url: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
    ein: /^([07][1-7]|1[0-6]|2[0-7]|[35][0-9]|[468][0-8]|9[0-589])-?\d{7}$/,
    zipCode: /^\d{5}(?:[-\s]\d{4})?$/,
    address: /^.{0,50}$/, // can be empty but max of 50 characters
    city: /^.{0,50}$/, // can be empty but max of 50 characters
    state: /^.{0,2}$/, // can be empty but max of 2 characters
    country: /^.{0,50}$/, // can be empty but max of 50 characters
  },
  currencyMaskConfig: {
    align: 'left',
    allowNegative: false,
    decimal: '.',
    precision: 2,
    prefix: '',
    nullable: false,
    suffix: '',
    thousands: ',',
    min: 0,
    max: 5000000,
  } as CurrencyMaskConfig,
});
