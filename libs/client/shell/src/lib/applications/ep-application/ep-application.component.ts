import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  HandleRestClient,
  UserFacade,
  UserRestClient,
  verifyHandleUniqueness,
  verifyUserEmailUniqueness,
} from '@involvemint/client/shared/data-access';
import { ConfirmDeactivationGuard, StatefulComponent } from '@involvemint/client/shared/util';
import { ImConfig, SubmitEpApplicationDto } from '@involvemint/shared/domain';
import { STATES } from '@involvemint/shared/util';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { tap } from 'rxjs/operators';

interface EpForm extends Omit<SubmitEpApplicationDto, 'address2'> {
  address2: string;
}

interface State {
  verifyingUserEmail: boolean;
  verifyingHandle: boolean;
}

@Component({
  selector: 'involvemint-ep-application',
  templateUrl: './ep-application.component.html',
  styleUrls: ['./ep-application.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpApplicationComponent
  extends StatefulComponent<State>
  implements OnInit, ConfirmDeactivationGuard
{
  baAdmin = false;
  applyFor: 'business' | 'yourself' = 'yourself';

  readonly epForm = new FormGroup<EpForm>({
    address1: new FormControl('', [(c) => Validators.required(c)]),
    address2: new FormControl(''),
    city: new FormControl('', [(c) => Validators.required(c)]),
    state: new FormControl('', [(c) => Validators.required(c)]),
    zip: new FormControl('', [(c) => Validators.required(c), Validators.pattern(ImConfig.regex.zipCode)]),
    email: new FormControl('', [
      (c) => (this.applyFor === 'business' ? Validators.required(c) : null),
      Validators.pattern(ImConfig.regex.email),
    ]),
    ein: new FormControl('', [Validators.pattern(ImConfig.regex.ein)]),
    handle: new FormControl('', [(c) => Validators.required(c), Validators.pattern(ImConfig.regex.handle)]),
    name: new FormControl('', [(c) => Validators.required(c)]),
    phone: new FormControl('', [(c) => Validators.required(c), Validators.pattern(ImConfig.regex.phone)]),
    website: new FormControl('', [Validators.pattern(ImConfig.regex.url)]),
  });

  selectedUSState = '';

  readonly USStates = STATES;

  constructor(
    private readonly user: UserFacade,
    private readonly userClient: UserRestClient,
    private readonly handleRestClient: HandleRestClient
  ) {
    super({ verifyingUserEmail: false, verifyingHandle: false });
  }

  @HostListener('window:beforeunload', ['$event'])
  canDeactivate() {
    return this.epForm.pristine;
  }

  ngOnInit(): void {
    this.effect(() =>
      this.user.session.selectors.state$.pipe(
        tap(({ baAdmin }) => {
          this.baAdmin = baAdmin;
          if (baAdmin) {
            this.applyFor = 'business';
          }
        })
      )
    );

    this.effect(() => verifyUserEmailUniqueness(this.epForm, this.userClient, this));

    this.effect(() => verifyHandleUniqueness(this.epForm, this.handleRestClient, this));

    this.effect(() =>
      this.user.session.actionListeners.submitEpApplication.success.pipe(tap(() => this.epForm.reset()))
    );
  }

  USStateChange(state: Event): void {
    this.epForm.patchValue({ state: (state as CustomEvent).detail.value }, { emitEvent: true });
  }

  submit() {
    this.epForm.markAsPristine();
    if (this.baAdmin && this.applyFor === 'business') {
      this.user.session.dispatchers.baSubmitEpApplication(this.epForm.value);
    } else {
      this.user.session.dispatchers.submitEpApplication(this.epForm.value);
    }
  }

  toggleApplyFor(event: Event): void {
    if ((event as CustomEvent).detail.value === 'business') {
      this.applyFor = 'business';
    } else if ((event as CustomEvent).detail.value === 'yourself') {
      this.applyFor = 'yourself';
    }
  }
}
