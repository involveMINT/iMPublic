import { IOneToOne } from '@orcha/common';
import { Poi } from '../poi';

export interface Task {
  id: string;

  poi: IOneToOne<Poi, 'task'>;
}
