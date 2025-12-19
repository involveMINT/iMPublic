import { createQuery } from '../repository';
import { Like } from './like.model';

/** Unsure if this will be needed for same reason as like.dto */
export const likeQuery = createQuery<Like>()({
  id: true,
  dateCreated: true,
  activityPost: {
    id: true
  },
  user: {
    id: true,
  }
})