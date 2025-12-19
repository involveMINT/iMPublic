import { createLogic } from '../repository';
import { ExchangePartner } from './exchange-partner.model';

export const transactionAmountExceedsEpBudget = createLogic<
  ExchangePartner,
  {
    budget: true;
    view: { receivedThisMonth: true };
  }
>()((ep, transactionAmount: number) => ep.view.receivedThisMonth + transactionAmount > ep.budget);
