import { IManyToOne, IOneToMany, IOneToOne } from '../repository';
import { Address } from '../address';
import { Enrollment } from '../enrollment';
import { ProjectDocument } from '../project-document';
import { Question } from '../question';
import { ServePartner } from '../serve-partner';

export type ProjectListingStatus = 'public' | 'unlisted' | 'private';
export const defaultProjectListingStatus: ProjectListingStatus = 'private';

export interface Project {
  id: string;
  title: string;
  imagesFilePaths: string[];
  description: string;
  listingStatus: ProjectListingStatus;
  creditsEarned: number;
  preferredScheduleOfWork: string;
  startDate?: Date | string;
  endDate?: Date | string;
  requireLocation: boolean;
  requireImages: boolean;
  maxChangeMakers: number;
  dateCreated: Date | string;
  dateUpdated: Date | string;
  requireCustomWaiver: boolean;
  customWaiverFilePath?: string;

  address: IOneToOne<Address, 'project'>;
  servePartner: IManyToOne<ServePartner, 'projects'>;
  enrollments: IOneToMany<Enrollment, 'project'>;
  questions: IOneToMany<Question, 'project'>;
  projectDocuments: IOneToMany<ProjectDocument, 'project'>;
}
