import { IOperation } from '@orcha/common';
import { CreateLikeDto,  RemoveLikeDto} from './like.dtos';
import { Like } from './like.model';

export interface ILikeOrchestration {
  create: IOperation<Like, CreateLikeDto>;
  remove: IOperation<Like, RemoveLikeDto>;
}