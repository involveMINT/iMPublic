import { IOneToMany, IOneToOne, IManyToOne } from '@orcha/common';
import { Poi } from '../poi';
import { User } from '../user';
import { Comment } from '../comment';


export interface ActivityPost {
  id: string;
  likes: number;
  dateCreated: Date | string;
  enabled: boolean;

  poi: IOneToOne<Poi, 'activityPost'>;
  user: IOneToMany<User, 'activityPosts'>;
  comments: IManyToOne<Comment, 'activityPost'>;

}