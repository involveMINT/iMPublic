import { createQuery } from '../repository';
import { ServeAdmin } from './serve-admin.model';

export const SpAdminQuery = createQuery<ServeAdmin[]>()({
  id: true,
  superAdmin: true,
  datePermitted: true,
  servePartner: { id: true },
  user: {
    id: true,
    changeMaker: {
      handle: { id: true },
      profilePicFilePath: true,
      firstName: true,
      lastName: true,
    },
  },
});
