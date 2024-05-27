import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  HandleRestClient,
  UserFacade,
  verifyHandleUniqueness,
} from '@involvemint/client/shared/data-access';
import { ConfirmDeactivationGuard, StatefulComponent } from '@involvemint/client/shared/util';
import { ImConfig, SubmitSpApplicationDto } from '@involvemint/shared/domain';
import { STATES } from '@involvemint/shared/util';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { tap } from 'rxjs/operators';

interface SpForm extends Omit<SubmitSpApplicationDto, 'address2'> {
  address2: string;
}

interface State {
  verifyingHandle: boolean;
}

@Component({
  selector: 'involvemint-application',
  templateUrl: './sp-application.component.html',
  styleUrls: ['./sp-application.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpApplicationComponent
  extends StatefulComponent<State>
  implements OnInit, ConfirmDeactivationGuard {
  readonly spForm = new FormGroup<SpForm>({
    address1: new FormControl('', [(c) => Validators.required(c)]),
    address2: new FormControl(''),
    city: new FormControl('', [(c) => Validators.required(c)]),
    state: new FormControl('', [(c) => Validators.required(c)]),
    zip: new FormControl('', [(c) => Validators.required(c), Validators.pattern(ImConfig.regex.zipCode)]),
    email: new FormControl('', [(c) => Validators.required(c), Validators.pattern(ImConfig.regex.email)]),
    handle: new FormControl('', [(c) => Validators.required(c), Validators.pattern(ImConfig.regex.handle)]),
    name: new FormControl('', [(c) => Validators.required(c)]),
    phone: new FormControl('', [(c) => Validators.required(c), Validators.pattern(ImConfig.regex.phone)]),
    website: new FormControl('', [(e) => Validators.required(e), Validators.pattern(ImConfig.regex.url)]),
  });

  selectedUSState = '';

  readonly USStates = STATES;

  constructor(private readonly user: UserFacade, private readonly handleRestClient: HandleRestClient) {
    super({ verifyingHandle: false });
  }

  @HostListener('window:beforeunload', ['$event'])
  canDeactivate() {
    return this.spForm.pristine;
  }

  ngOnInit(): void {
    this.effect(() => verifyHandleUniqueness(this.spForm, this.handleRestClient, this));

    this.effect(() =>
      this.user.session.actionListeners.submitSpApplication.success.pipe(tap(() => this.spForm.reset()))
    );
  }

  USStateChange(state: Event): void {
    this.spForm.patchValue({ state: (state as CustomEvent).detail.value }, { emitEvent: true });
  }

  submit() {
    this.spForm.markAsPristine();
    this.user.session.dispatchers.submitSpApplication(this.spForm.value);
  }
}
