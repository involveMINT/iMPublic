import { IOperation } from '@orcha/common';
import { CreateCommentDto, 
        HideCommentDto, 
        UnhideCommentDto } from './comment.dtos';
import { Comment } from './comment.model';

export interface ICommentOrchestration {
  list: IOperation<Comment[]>;
  /** !Ability to get comment may be needed in future for moderation! */
  create: IOperation<Comment, CreateCommentDto>;

  hide: IOperation<Comment, HideCommentDto>;
  unhide: IOperation<Comment, UnhideCommentDto>;
}
