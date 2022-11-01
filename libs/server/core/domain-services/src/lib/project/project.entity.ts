import {
  defaultProjectListingStatus,
  ImConfig,
  Project,
  ProjectListingStatus,
} from '@involvemint/shared/domain';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { AddressEntity } from '../address/address.entity';
import { DbTableNames } from '../db-table-names';
import { EnrollmentEntity } from '../enrollment/enrollment.entity';
import { ProjectDocumentEntity } from '../project-document/project-document.entity';
import { QuestionEntity } from '../question/question.entity';
import { ServePartnerEntity } from '../serve-partner/serve-partner.entity';

@Entity({ name: DbTableNames.Project })
export class ProjectEntity implements Required<Project> {
  @PrimaryColumn('text')
  id!: string;

  @Column()
  description!: string;

  @Column('text', { default: defaultProjectListingStatus })
  listingStatus!: ProjectListingStatus;

  @Column()
  title!: string;

  @Column({ default: '' })
  city!: string;

  @Column({ default: '' })
  state!: string;

  @Column('text', { array: true, default: '{}' })
  imagesFilePaths!: string[];

  @Column({ default: ImConfig.maxTCPerDay })
  creditsEarned!: number;

  @Column({ default: '' })
  preferredScheduleOfWork!: string;

  @Column({ nullable: true })
  startDate!: Date;

  @Column({ nullable: true })
  endDate!: Date;

  @Column({ default: true })
  requireLocation!: boolean;

  @Column({ default: true })
  requireImages!: boolean;

  @Column({ default: 5 })
  maxChangeMakers!: number;

  @Column({ default: 'NOW()' })
  dateCreated!: Date;

  @Column({ default: 'NOW()' })
  dateUpdated!: Date;

  @Column({ default: false })
  requireCustomWaiver!: boolean;

  @Column({ nullable: true })
  customWaiverFilePath!: string;

  @OneToOne(() => AddressEntity, (e) => e.project, { nullable: false, cascade: true })
  @JoinColumn()
  address!: AddressEntity;

  @ManyToOne(() => ServePartnerEntity, (e) => e.projects)
  servePartner!: ServePartnerEntity;

  @OneToMany(() => EnrollmentEntity, (e) => e.project)
  enrollments!: EnrollmentEntity[];

  @OneToMany(() => QuestionEntity, (p) => p.project, { nullable: false, cascade: true })
  questions!: QuestionEntity[];

  @OneToMany(() => ProjectDocumentEntity, (p) => p.project, { nullable: false, cascade: true })
  projectDocuments!: ProjectDocumentEntity[];
}
