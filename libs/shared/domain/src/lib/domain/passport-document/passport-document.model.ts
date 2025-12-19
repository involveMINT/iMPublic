import { IManyToOne, IOneToMany } from '../repository';
import { ChangeMaker } from '../change-maker';
import { EnrollmentDocument } from '../enrollment-document';

export interface PassportDocument {
  id: string;
  name: string;
  filePath: string;
  uploadedDate: Date | string;

  changeMaker: IManyToOne<ChangeMaker, 'passportDocuments'>;
  enrollmentDocuments: IOneToMany<EnrollmentDocument, 'passportDocument'>;
}
