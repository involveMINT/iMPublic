import { createLogic } from '@orcha/common';
import { ImConfig } from '../../config/im-config';
import { Credit } from './credit.model';

export type EntityType = 'changeMaker' | 'servePartner' | 'exchangePartner';

/**
 * Gets the negative balance limit for a given entity type.
 * @param entityType The type of entity (changeMaker, servePartner, exchangePartner)
 * @returns The negative balance limit in cents (positive number representing max negative)
 */
export function getNegativeBalanceLimit(entityType: EntityType): number {
  return ImConfig.negativeBalanceLimit[entityType];
}

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
