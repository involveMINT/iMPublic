import { IManyToOne } from '@orcha/common';
import { User } from '../user';
import { ActivityPost } from '../activity-post'


export interface Comment {
  id: string;
  text: string;

  activityPost: IManyToOne<ActivityPost, 'comments'>;
  user: IManyToOne<User, 'comments'>;

  dateCreated: Date | string;
  hidden: boolean;
}

export interface Comments {
  id: string;
  comments: Comment[];
}

export interface FormattedComments {
  id: string;
  comments: Comment[];
}
