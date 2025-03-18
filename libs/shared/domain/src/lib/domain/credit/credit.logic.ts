import { createLogic } from '../repository';
import { Credit } from './credit.model';

export const calculateTotalCreditsAmount = createLogic<Credit[], { escrow: true; amount: true }>()(
  (credits) => {
    let amount = 0;
    credits.filter((c) => !c.escrow).forEach((c) => (amount += c.amount));
    return amount;
  }
);

export const calculateTotalEscrowAmount = createLogic<Credit[], { escrow: true; amount: true }>()(
  (credits) => {
    let amount = 0;
    credits.filter((c) => c.escrow).forEach((c) => (amount += c.amount));
    return amount;
  }
);
