import { IManyToOne, IOneToMany } from '../repository';
import { EnrollmentDocument } from '../enrollment-document';
import { Project } from '../project';

export interface ProjectDocument {
  id: string;
  title: string;
  description: string;
  infoUrl: string;

  project: IManyToOne<Project, 'projectDocuments'>;
  enrollmentDocuments: IOneToMany<EnrollmentDocument, 'projectDocument'>;
}
