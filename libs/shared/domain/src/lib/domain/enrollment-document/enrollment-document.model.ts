import { IManyToOne } from '@orcha/common';
import { Enrollment } from '../enrollment';
import { PassportDocument } from '../passport-document';
import { ProjectDocument } from '../project-document';

export interface EnrollmentDocument {
  id: string;

  projectDocument: IManyToOne<ProjectDocument, 'enrollmentDocuments'>;
  passportDocument: IManyToOne<PassportDocument, 'enrollmentDocuments'>;
  enrollment: IManyToOne<Enrollment, 'enrollmentDocuments'>;
}
