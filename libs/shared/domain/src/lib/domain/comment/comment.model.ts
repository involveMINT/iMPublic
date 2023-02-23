import { IOneToMany } from '@orcha/common';
import { User } from '../user';
import {ActivityPost } from '../activity-post'


export interface Comment {
  id: string;
  dateCreated: Date | string;
  text: string;
  hidden: boolean;

  activityPost: IOneToMany<ActivityPost, 'comments'>;
  user: IOneToMany<User, 'comments'>;

}