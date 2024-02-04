import { IManyToOne, IOneToMany, IOneToOne } from '../repository';
import { Credit } from '../credit';
import { Enrollment } from '../enrollment';
import { QuestionAnswer } from '../question-answer';
import { Task } from '../task';

export interface Poi {
  id: string;
  dateCreated: Date | string;
  dateStarted?: Date | string;
  dateStopped?: Date | string;
  dateSubmitted?: Date | string;
  dateApproved?: Date | string;
  dateDenied?: Date | string;
  imagesFilePaths: string[];
  latitude?: number;
  longitude?: number;
  pausedTimes: Array<Date | string>;
  resumedTimes: Array<Date | string>;

  answers: IOneToMany<QuestionAnswer, 'poi'>;
  enrollment: IManyToOne<Enrollment, 'pois'>;
  credits: IOneToMany<Credit, 'poi'>;
  task?: IOneToOne<Task, 'poi'>;
}
