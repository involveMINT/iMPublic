import { createQuery } from '@orcha/common';
import { Like } from './like.model';

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