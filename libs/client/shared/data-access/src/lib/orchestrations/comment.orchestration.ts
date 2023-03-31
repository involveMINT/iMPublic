import { ClientOperation, ClientOrchestration, IClientOrchestration } from '@orcha/angular';
import { InvolvemintOrchestrations } from '@involvemint/shared/domain';
import { ICommentOrchestration } from 'libs/shared/domain/src/lib/domain/comment';

@ClientOrchestration(InvolvemintOrchestrations.comment)
export class CommentOrchestration implements IClientOrchestration<ICommentOrchestration> {
    @ClientOperation()
    list!: IClientOrchestration<ICommentOrchestration>['list'];

    @ClientOperation()
    create!: IClientOrchestration<ICommentOrchestration>['create'];

    @ClientOperation()
    hide!: IClientOrchestration<ICommentOrchestration>['hide'];

    @ClientOperation()
    unhide!: IClientOrchestration<ICommentOrchestration>['unhide'];
}
