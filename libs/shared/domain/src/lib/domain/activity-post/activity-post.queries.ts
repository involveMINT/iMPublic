import { createQuery } from '@orcha/common';
import { CommentQuery } from '../comment';
import { PoiCmQuery } from '../poi';
import { ActivityPostUserQuery } from '../user';
import { ActivityPost } from './activity-post.model';


export const ActivityPostQuery = createQuery<ActivityPost>()({
  id: true,
  likeCount: true,
  dateCreated: true,
  enabled: true,
  poi: {
    ...PoiCmQuery
  },
  user: {
    ...ActivityPostUserQuery
  },
  comments: {
    ...CommentQuery
  },
  likes: {
    id: true,
    user: {
      id: true
    },
    dateCreated: true
  }
});

export const ActivityFeedQuery = createQuery<ActivityPost[]>()({
  ...ActivityPostQuery,
  __paginate: {
    limit: 10,
    page: 1,
  }
});
