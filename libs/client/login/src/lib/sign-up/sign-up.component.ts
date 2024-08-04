import { ChangeDetectionStrategy, Component, ContentChild, OnInit } from '@angular/core';
import { ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ImLegalModalInputs, ImLegalModalService, UserFacade } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { ConfirmPasswordValidator, StatefulComponent } from '@involvemint/client/shared/util';
import { ImConfig, SignUpDto } from '@involvemint/shared/domain';
import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@ngneat/reactive-forms';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';

interface State {
  errorStatus: string;
}

@Component({
  selector: 'login-sign-up-page',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../styles/form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent extends StatefulComponent<State> implements OnInit {
  isPasswordVisible = false;
  isConfirmPasswordVisible = false;
  readonly signUpForm = new FormGroup(
    {

      email: new FormControl(
        '',
        Validators.compose([(c) => Validators.required(c), Validators.pattern(ImConfig.regex.email)])
      ),
      password: new FormControl(
        '',
        Validators.compose([(c) => Validators.required(c), Validators.pattern(ImConfig.regex.password.regex)])
      ),
      confirmPassword: new FormControl(
        '',
        Validators.compose([(c) => Validators.required(c), Validators.pattern(ImConfig.regex.password.regex)])
      ),
      acceptTC: new FormControl(false, this.validateIfChecked()),
    },
    { validators: (ac) => ConfirmPasswordValidator.MatchPassword(ac, 'password', 'confirmPassword') }
  );

  registerAs?: SignUpDto['registerAs'];

  readonly pwdValidationText = ImConfig.regex.password.text;

  constructor(
    private readonly route: RouteService,
    private readonly uf: UserFacade,
    private readonly activatedRoute: ActivatedRoute,
    private readonly legalModal: ImLegalModalService

  ) {
    super({ errorStatus: '' });
  }

  private validateIfChecked(): ValidatorFn {
    return ((checkBox: AbstractControl): ValidationErrors | null => {
      const checked: string = checkBox.value;
      if (!checked) {
        return { err: true };
      }
      return null;
    }) as ValidatorFn;
  }

  async legal(type: ImLegalModalInputs['type']): Promise<void> {
    this.legalModal.open({ type });
  }

  ngOnInit(): void {
    this.effect(() =>
      merge(this.uf.session.actionListeners.signUp.error, this.uf.session.actionListeners.login.error).pipe(
        tap(({ error }) => {
          this.updateState({ errorStatus: error.message });
        })
      )
    );

    this.effect(() =>
      this.activatedRoute.queryParams.pipe(
        tap((query) => {
          this.registerAs = query['register'];
        })
      )
    );
  }

  async submit(): Promise<void> {
    this.updateState({ errorStatus: '' });
    this.uf.session.dispatchers.signUp({
      id: this.signUpForm.value.email,
      password: this.signUpForm.value.password,
      registerAs: this.registerAs,
    });
  }

  async backToLoginPage(): Promise<void> {
    await this.route.to.login.ROOT({ animation: 'back' });
    this.updateState({ errorStatus: '' });
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }
  // doGoogleLogin(): void {
  //   this.uf.session.dispatchers.googleSignIn(environment.authPersistance);
  // }
}


