import { createQuery } from '../repository';
import { PassportDocument } from './passport-document.model';

export const PassportDocumentQuery = createQuery<PassportDocument>()({
  id: true,
  name: true,
  filePath: true,
  uploadedDate: true,
  enrollmentDocuments: {
    id: true,
    enrollment: {
      id: true,
      project: {
        id: true,
        title: true,
      },
    },
    projectDocument: {
      title: true,
    },
  },
});

export const DeletePassportDocumentQuery = createQuery<{ deletedId: true }>()({ deletedId: true });
