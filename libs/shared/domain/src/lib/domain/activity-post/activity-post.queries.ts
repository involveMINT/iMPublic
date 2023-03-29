import { createQuery } from '@orcha/common';
import { CommentQuery } from '../comment';
import { PoiCmQuery } from '../poi';
import { UserQuery } from '../user';
import { ActivityPost } from './activity-post.model';

/** ?Think these are used for validations + data returned? */
export const ActivityPostQuery = createQuery<ActivityPost>()({
  id: true,
  likeCount: true,
  dateCreated: true,
  enabled: true,
  poi: {
    ...PoiCmQuery
  },
  user: {
    ...UserQuery
  },
  comments: {
    ...CommentQuery
  },
  likes: {
    id: true,
    user: {
      id: true
    },
  }
});
