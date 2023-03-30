import { IOperation } from '@orcha/common';
import { RecentActivityPostDto,
         CreateActivityPostDto, 
         DisableActivityPostDto, 
         EnableActivityPostDto, 
         LikeActivityPostDto, 
         UnlikeActivityPostDto } from './activity-post.dtos';
import { ActivityPost } from './activity-post.model';

export interface IActivityPostOrchestration {
  list: IOperation<ActivityPost[], RecentActivityPostDto>;
  /** !May be a need to do get for individual Post in the future! */
  create: IOperation<ActivityPost, CreateActivityPostDto>;

  enable: IOperation<ActivityPost, EnableActivityPostDto>;
  disable: IOperation<ActivityPost, DisableActivityPostDto>;

  like: IOperation<ActivityPost, LikeActivityPostDto>;
  unlike: IOperation<ActivityPost, UnlikeActivityPostDto>;
}
