import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { UserFacade, UserStoreModel } from '@involvemint/client/shared/data-access';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { ImConfig } from '@involvemint/shared/domain';
import { parseDate, UnArray } from '@involvemint/shared/util';
import { FormControl } from '@ngneat/reactive-forms';
import { subMonths } from 'date-fns';
import { merge } from 'rxjs';
import { debounceTime, filter, skip, tap } from 'rxjs/operators';

type Profile = NonNullable<UnArray<UserStoreModel['exchangeAdmins']>['exchangePartner']>;

interface State {
  profile: Profile | null;
  saving: null | 'saving' | 'saved';
}

@Component({
  selector: 'involvemint-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetComponent extends StatefulComponent<State> implements OnInit {
  @ViewChild('budgetInp') budgetInp!: ElementRef<HTMLInputElement>;

  readonly budget = new FormControl<number>(0, (e) => Validators.required(e));
  
  constructor(private readonly user: UserFacade) {
    super({ profile: null, saving: null });
  }

  ngOnInit(): void {
    this.effect(() =>
      this.user.session.selectors.activeProfileEp$.pipe(
        tap((profile) => {
          this.budget.patchValue(profile.budget / 100, { emitEvent: false });
          this.updateState({ profile });
        })
      )
    );

    this.effect(() =>
      merge(
        this.user.epProfile.actionListeners.editEpProfile.success,
        this.user.epProfile.actionListeners.editEpProfile.error
      ).pipe(
        tap(() => {
          this.updateState({ saving: 'saved' });
          setTimeout(() => this.updateState({ saving: null }), 2000);
        })
      )
    );

    this.effect(() =>
      this.budget.valueChanges.pipe(
        tap((budget) => {
          if (!budget) {
            this.budget.patchValue(0, { emitEvent: false });
          }
        }),
        skip(1),
        tap(() => this.updateState({ saving: 'saving' })),
        debounceTime(ImConfig.formDebounceTime),
        filter(() => this.budget.valid),
        tap((budget) => {
          this.user.epProfile.dispatchers.editEpProfile({ budget: Number((budget * 100).toFixed(2)) });
        })
      )
    );
  }

  subOneMonth(date: Date | string) {
    return subMonths(parseDate(date), 1);
  }

  focus() {
    this.budgetInp.nativeElement.focus();
  }
}
