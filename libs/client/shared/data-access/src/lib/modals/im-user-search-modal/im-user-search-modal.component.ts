import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { ImConfig, User, UserSearchQuery } from '@involvemint/shared/domain';
import { ModalController } from '@ionic/angular';
import { FormControl } from '@ngneat/reactive-forms';
import { IParser } from '@orcha/common';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';
import { UserOrchestration } from '../../orchestrations';

export interface ImUserSearchModalInputs {
  title: string;
  header?: string;
}

export type UserSearchResult = IParser<User, typeof UserSearchQuery>;

interface State {
  users: UserSearchResult[];
  status: 'init' | 'loading' | 'done';
}

@Component({
  selector: 'im-user-search-modal',
  templateUrl: './im-user-search-modal.component.html',
  styleUrls: ['./im-user-search-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImUserSearchModalComponent
  extends StatefulComponent<State>
  implements OnInit, ImUserSearchModalInputs
{
  @Input() title = 'Search For User';
  @Input() header?: string;

  readonly search = new FormControl('');

  constructor(private readonly userOrcha: UserOrchestration, private readonly modal: ModalController) {
    super({ users: [], status: 'init' });
  }

  ngOnInit(): void {
    this.effect(() =>
      this.search.valueChanges.pipe(
        filter((search) => {
          if (!search) {
            this.updateState({ users: [], status: 'init' });
            return false;
          }
          this.updateState({ status: 'loading' });
          return true;
        }),
        debounceTime(ImConfig.formDebounceTime),
        switchMap((s) => this.userOrcha.searchUsers(UserSearchQuery, { emailSearchString: s })),
        tap((users) => this.updateState({ users, status: 'done' }))
      )
    );
  }

  select(handle: UserSearchResult) {
    this.modal.dismiss(handle);
  }

  close() {
    this.modal.dismiss(undefined);
  }
}
