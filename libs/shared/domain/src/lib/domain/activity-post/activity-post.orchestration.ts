import { IOperation } from '@orcha/common';
import { CreateActivityPostDto, 
         DisableActivityPostDto, 
         EnableActivityPostDto, 
         LikeActivityPostDto, 
         UnlikeActivityPostDto } from './activity-post.dtos';
import { ActivityPost } from './activity-post.model';

export interface IActivityPostOrchestration {
  create: IOperation<ActivityPost, CreateActivityPostDto>;

  enable: IOperation<ActivityPost, EnableActivityPostDto>;
  disable: IOperation<ActivityPost, DisableActivityPostDto>;

  like: IOperation<ActivityPost, LikeActivityPostDto>;
  unlike: IOperation<ActivityPost, UnlikeActivityPostDto>;
}