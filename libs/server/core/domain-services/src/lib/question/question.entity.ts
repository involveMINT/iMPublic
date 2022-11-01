import { Question } from '@involvemint/shared/domain';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { DbTableNames } from '../db-table-names';
import { ProjectEntity } from '../project/project.entity';
import { QuestionAnswerEntity } from '../question-answer/question-answer.entity';

@Entity({ name: DbTableNames.Question })
export class QuestionEntity implements Required<Question> {
  @PrimaryColumn('text')
  id!: string;

  @Column()
  text!: string;

  @ManyToOne(() => ProjectEntity, (p) => p.questions)
  project!: ProjectEntity;

  @OneToMany(() => QuestionAnswerEntity, (p) => p.question)
  answers!: QuestionAnswerEntity[];
}
