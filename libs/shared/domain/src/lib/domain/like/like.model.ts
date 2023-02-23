import { IOneToMany, IOneToOne } from '@orcha/common';
import { ActivityPost } from '../activity-post';
import { User } from '../user';


export interface Like {
  id: string;
  dateCreated: Date | string;

  activityPost: IOneToMany<ActivityPost, 'likes'>;
  user: IOneToMany<User, 'likes'>;

}