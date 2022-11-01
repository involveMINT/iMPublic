import { QuestionAnswer } from '@involvemint/shared/domain';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { DbTableNames } from '../db-table-names';
import { PoiEntity } from '../poi/poi.entity';
import { QuestionEntity } from '../question/question.entity';

@Entity({ name: DbTableNames.QuestionAnswer })
export class QuestionAnswerEntity implements Required<QuestionAnswer> {
  @PrimaryColumn('text')
  id!: string;

  @Column()
  answer!: string;

  @Column({ default: 'NOW()' })
  dateAnswered!: Date;

  @ManyToOne(() => QuestionEntity, (p) => p.answers, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  question!: QuestionEntity;

  @ManyToOne(() => PoiEntity, (p) => p.answers, { onDelete: 'CASCADE' })
  poi!: PoiEntity;
}
