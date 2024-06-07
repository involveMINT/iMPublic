import { createQuery } from '../repository';
import { Credit } from './credit.model';

export const CreditQuery = createQuery<Credit>()({
  id: true,
  amount: true,
  dateMinted: true,
  escrow: true,
  changeMaker: { id: true },
  exchangePartner: { id: true },
  servePartner: { id: true },
  poi: { id: true },
});
