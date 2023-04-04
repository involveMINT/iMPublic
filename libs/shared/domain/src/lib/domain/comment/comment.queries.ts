import { createQuery } from '@orcha/common';
import { Comment } from './comment.model';

export const CommentQuery = createQuery<Comment>()({
  id: true,
  text: true,
  user: {
    id: true,
  },
  dateCreated: true,
  hidden: true,
  handleId: true,
  profilePicFilePath: true,
  name: true
})