import { createQuery } from '@orcha/common';
import { Comment } from './comment.model';

export const commentQuery = createQuery<Comment>()({
  id: true,
  text: true,
  dateCreated: true,
  hidden: true,
  activityPost: {
    id: true
  },
  user: {
    id: true,
  }
})