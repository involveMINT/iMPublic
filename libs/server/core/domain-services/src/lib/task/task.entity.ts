import { Task } from '@involvemint/shared/domain';
import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { DbTableNames } from '../db-table-names';
import { PoiEntity } from '../poi/poi.entity';

@Entity({ name: DbTableNames.Task })
export class TaskEntity implements Required<Task> {
  @PrimaryColumn('text')
  id!: string;

  @OneToOne(() => PoiEntity, (e) => e.task, { cascade: true, nullable: false })
  @JoinColumn()
  poi!: PoiEntity;
}
