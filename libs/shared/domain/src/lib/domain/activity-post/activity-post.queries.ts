import { createQuery } from '@orcha/common';
import { ActivityPost } from './activity-post.model';

export const activityPostQuery = createQuery<ActivityPost>()({
  id: true,
  likes: true,
  dateCreated: true,
  enabled: true,
  poi: {
    id: true
  },
  user: {
    id: true,
  },
})