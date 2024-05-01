import { Enrollment } from '@involvemint/shared/domain';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { ChangeMakerEntity } from '../change-maker/change-maker.entity';
import { DbTableNames } from '../db-table-names';
import { EnrollmentDocumentEntity } from '../enrollment-document/enrollment-document.entity';
import { PoiEntity } from '../poi/poi.entity';
import { ProjectEntity } from '../project/project.entity';

@Entity({ name: DbTableNames.Enrollment })
export class EnrollmentEntity implements Required<Enrollment> {
  @PrimaryColumn('text')
  id!: string;

  @Column()
  dateApplied!: Date;

  @Column({ nullable: true })
  dateSubmitted!: Date;

  @Column({ nullable: true })
  dateApproved!: Date;

  @Column({ nullable: true })
  dateDenied!: Date;

  @Column({ nullable: true })
  dateRetired!: Date;

  @Column({ default: false })
  acceptedWaiver!: boolean;

  @ManyToOne(() => ChangeMakerEntity, (e) => e.enrollments)
  changeMaker!: ChangeMakerEntity;

  @ManyToOne(() => ProjectEntity, (e) => e.enrollments)
  project!: ProjectEntity;

  @ManyToMany(() => PoiEntity, (e) => e.enrollments)
  pois!: PoiEntity[];

  @OneToMany(() => EnrollmentDocumentEntity, (doc) => doc.enrollment, { cascade: true })
  enrollmentDocuments!: EnrollmentDocumentEntity[];
}
