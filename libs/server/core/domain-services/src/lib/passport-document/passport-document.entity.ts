import { PassportDocument } from '@involvemint/shared/domain';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { ChangeMakerEntity } from '../change-maker/change-maker.entity';
import { DbTableNames } from '../db-table-names';
import { EnrollmentDocumentEntity } from '../enrollment-document/enrollment-document.entity';

@Entity({ name: DbTableNames.PassportDocuments })
export class PassportDocumentEntity implements Required<PassportDocument> {
  @PrimaryColumn('text')
  id!: string;

  @Column()
  filePath!: string;

  @Column()
  name!: string;

  @Column()
  uploadedDate!: Date;

  // If cm deletes account, delete passport document references via `cascade`
  @ManyToOne(() => ChangeMakerEntity, (p) => p.passportDocuments, { cascade: true })
  changeMaker!: ChangeMakerEntity;

  @OneToMany(() => EnrollmentDocumentEntity, (doc) => doc.passportDocument)
  enrollmentDocuments!: EnrollmentDocumentEntity[];
}
