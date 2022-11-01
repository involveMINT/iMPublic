import { EnrollmentDocument } from '@involvemint/shared/domain';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { DbTableNames } from '../db-table-names';
import { EnrollmentEntity } from '../enrollment/enrollment.entity';
import { PassportDocumentEntity } from '../passport-document/passport-document.entity';
import { ProjectDocumentEntity } from '../project-document/project-document.entity';

@Entity({ name: DbTableNames.EnrollmentDocument })
export class EnrollmentDocumentEntity implements Required<EnrollmentDocument> {
  @PrimaryColumn('text')
  id!: string;

  @ManyToOne(() => PassportDocumentEntity, (p) => p.enrollmentDocuments)
  passportDocument!: PassportDocumentEntity;

  // If a Project document get deleted, also delete this EnrollmentDocument linking the two
  @ManyToOne(() => ProjectDocumentEntity, (p) => p.enrollmentDocuments)
  projectDocument!: ProjectDocumentEntity;

  @ManyToOne(() => EnrollmentEntity, (p) => p.enrollmentDocuments)
  enrollment!: EnrollmentEntity;
}
