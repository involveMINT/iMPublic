import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserRestClient } from '@involvemint/client/shared/data-access';
import { RxJSBaseClass } from '@involvemint/client/shared/util';
import { AdminUserSearchQuery, ImConfig, User, IParser } from '@involvemint/shared/domain';
import { FormControl } from '@ngneat/reactive-forms';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'admin-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent extends RxJSBaseClass implements OnInit {
  readonly search = new FormControl<string>('');

  users: IParser<User, typeof AdminUserSearchQuery>[] = [];

  loading = false;

  constructor(private readonly userClient: UserRestClient, private readonly change: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.search.valueChanges
      .pipe(
        filter((s) => {
          if (!s) {
            this.users = [];
            this.change.markForCheck();
            this.loading = false;
            return false;
          }
          this.loading = true;
          return true;
        }),
        debounceTime(ImConfig.formDebounceTime),
        switchMap((s) => this.userClient.adminUserSearch(AdminUserSearchQuery, { searchStr: s })),
        tap((c) => {
          this.users = c;
          this.loading = false;
          this.change.markForCheck();
        })
      )
      .subscribe();
  }
}
