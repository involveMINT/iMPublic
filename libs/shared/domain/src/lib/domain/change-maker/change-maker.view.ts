import { IOneToOne } from '../repository';
import { ChangeMaker } from './change-maker.model';

export interface ChangeMakerView {
  secondsCompleted: number;
  poiApproved: number;
  earnedCredits: number;
  spentCredits: number;

  changeMaker: IOneToOne<ChangeMaker, 'view'>;
}
