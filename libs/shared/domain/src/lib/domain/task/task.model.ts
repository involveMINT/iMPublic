import { IOneToOne } from '../repository';
import { Poi } from '../poi';

export interface Task {
  id: string;

  poi: IOneToOne<Poi, 'task'>;
}
