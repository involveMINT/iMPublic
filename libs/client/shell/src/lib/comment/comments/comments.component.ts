import { Component } from '@angular/core';
import { CommentService, UserFacade } from '@involvemint/client/shared/data-access';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

interface State {
    loaded: boolean;
  }

@Component({
  selector: 'involvemint-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent extends StatefulComponent<State> {
  private searchStr$ = new BehaviorSubject<string>('');

  constructor(
    private readonly commentService: CommentService,
    private readonly uf: UserFacade,
    private readonly modal: ModalController
  ) {
    super({ loaded: false });
  }
}