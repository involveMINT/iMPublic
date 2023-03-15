import { createQuery } from '@orcha/common';
import { likeQuery } from '../like';
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
    text: true,
    user: {
      id: true
    },
    hidden: true
  },
  likes: {
    id: true,
  }
});
