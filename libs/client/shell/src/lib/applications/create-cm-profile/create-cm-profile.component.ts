import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  HandleRestClient,
  UserFacade,
  verifyHandleUniqueness,
} from '@involvemint/client/shared/data-access';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { CmOnboardingState, ImConfig } from '@involvemint/shared/domain';
import { DeepReadonly, STATES } from '@involvemint/shared/util';
import { IonSlides } from '@ionic/angular';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { subYears } from 'date-fns';
import { takeUntil, tap } from 'rxjs/operators';

/**
 * Schema to create ChangeMaker Profile
 */
export interface CreateCmProfileFormData {
  handle: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface State {
  verifyingHandle: boolean;
}

@Component({
  selector: 'involvemint-create-cm-profile',
  templateUrl: './create-cm-profile.component.html',
  styleUrls: ['./create-cm-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCmProfileComponent extends StatefulComponent<State> implements OnInit, AfterViewInit {
  @ViewChild('slides', { static: false }) slides!: IonSlides;

  readonly createProfileForm = new FormGroup<CreateCmProfileFormData>({
    handle: new FormControl('', [(c) => Validators.required(c), Validators.pattern(ImConfig.regex.handle)]),
    firstName: new FormControl('', [
      (c) => Validators.required(c),
      Validators.pattern(ImConfig.regex.firstName),
    ]),
    lastName: new FormControl('', [
      (c) => Validators.required(c),
      Validators.pattern(ImConfig.regex.lastName),
    ]),
    phone: new FormControl('', [(c) => Validators.required(c), Validators.pattern(ImConfig.regex.phone)]),
  });

  readonly states = STATES;

  onboardingState?: CmOnboardingState;
  readonly maxDate = subYears(Date.now(), 18);

  constructor(
    private readonly uf: UserFacade,
    private readonly handleRestClient: HandleRestClient,
    private readonly route: ActivatedRoute
  ) {
    super({ verifyingHandle: false });
  }

  ngOnInit(): void {
    this.effect(() => verifyHandleUniqueness(this.createProfileForm, this.handleRestClient, this));
    this.route.queryParams
      .pipe(
        tap((q) => {
          if (q['register']) {
            this.onboardingState = q['register'];
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.slides.lockSwipes(true);
  }

  next() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  prev() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  submit(): void {
    this.uf.session.dispatchers.createCmProfile({
      ...this.createProfileForm.value,
      onboardingState: this.onboardingState,
    });
  }

  /** Prevents non-validation when using auto-fill on a browser */
  setPhoneVal(field: DeepReadonly<Event>): void {
    if (field) {
      this.createProfileForm.patchValue(
        { phone: (field.target as HTMLInputElement).value },
        { emitEvent: false }
      );
    }
  }
}
