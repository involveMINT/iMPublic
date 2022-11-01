import { ChangeMaker } from './change-maker';
import { ExchangePartner } from './exchange-partner';
import { ServePartner } from './serve-partner';

export type Profile =
  | (ChangeMaker & { type: 'cm' })
  | (ExchangePartner & { type: 'ep' })
  | (ServePartner & { type: 'sp' });
