import { IOperation } from '@orcha/common';
import { RecentActivityPostDto,
         CreateActivityPostDto, 
         DigestActivityPostDto, 
         DisableActivityPostDto, 
         DisplayCommentsDto, 
         EnableActivityPostDto, 
         LikeActivityPostDto, 
         UnlikeActivityPostDto, 
         GetActivityPostDto} from './activity-post.dtos';
import { ActivityPost } from './activity-post.model';

export interface IActivityPostOrchestration {
  list: IOperation<ActivityPost[]>;

  get: IOperation<ActivityPost, GetActivityPostDto>;
  create: IOperation<ActivityPost, CreateActivityPostDto>;

  enable: IOperation<ActivityPost, EnableActivityPostDto>;
  disable: IOperation<ActivityPost, DisableActivityPostDto>;

  like: IOperation<ActivityPost, LikeActivityPostDto>;
  unlike: IOperation<ActivityPost, UnlikeActivityPostDto>;

  digest: IOperation<ActivityPost[], DigestActivityPostDto>;
}
