import { IManyToOne, IOneToMany } from '../repository';
import { Project } from '../project';
import { QuestionAnswer } from '../question-answer';

export interface Question {
  id: string;
  text: string;

  project: IManyToOne<Project, 'questions'>;
  answers: IOneToMany<QuestionAnswer, 'question'>;
}
