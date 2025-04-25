import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ProjectEntity } from '../project/project.entity';

@Entity({ name: 'clearances' })
export class ClearanceEntity {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  label!: string;

  @Column('text')
  projectId!: string;

  @ManyToOne(() => ProjectEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project!: ProjectEntity;
}
