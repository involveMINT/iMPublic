import { ProjectDocument } from '@involvemint/shared/domain';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { DbTableNames } from '../db-table-names';
import { EnrollmentDocumentEntity } from '../enrollment-document/enrollment-document.entity';
import { ProjectEntity } from '../project/project.entity';

@Entity({ name: DbTableNames.ProjectDocument })
export class ProjectDocumentEntity implements Required<ProjectDocument> {
  @PrimaryColumn('text')
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  infoUrl!: string;

  @ManyToOne(() => ProjectEntity, (p) => p.projectDocuments)
  project!: ProjectEntity;

  @OneToMany(() => EnrollmentDocumentEntity, (p) => p.projectDocument)
  enrollmentDocuments!: EnrollmentDocumentEntity[];
}
