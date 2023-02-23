import { IOperation } from '@orcha/common';
import { CreateCommentDto, 
        HideCommentDto, 
        UnhideCommentDto } from './comment.dtos';
import { Comment } from './comment.model';

export interface ICommentOrchestration {
  create: IOperation<Comment, CreateCommentDto>;

  hide: IOperation<Comment, HideCommentDto>;
  unhide: IOperation<Comment, UnhideCommentDto>;
}