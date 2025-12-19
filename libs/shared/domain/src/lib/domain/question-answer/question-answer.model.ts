import { IManyToOne } from '../repository';
import { Poi } from '../poi/poi.model';
import { Question } from '../question';

export interface QuestionAnswer {
  id: string;
  answer: string;
  dateAnswered: Date | string;

  question: IManyToOne<Question, 'answers'>;
  poi: IManyToOne<Poi, 'answers'>;
}
