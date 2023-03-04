import { createQuery } from '@orcha/common';
import { ActivityPost } from './activity-post.model';

/** ?Think these are used for validations + data returned? */
export const ActivityPostQuery = createQuery<ActivityPost>()({
  id: true,
  likeCount: true,
  dateCreated: true,
  enabled: true,
  poi: {
    id: true,
    /** Probably want to fetch entirety of POI */
  },
  user: {
    id: true,
    /** Probably want to fetch handler of user */
  },
  comments: {
    text: true,
    user: {
      id: true
    },
    hidden: true
  }
});
