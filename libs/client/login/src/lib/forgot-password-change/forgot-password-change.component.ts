import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserRestClient } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { ConfirmPasswordValidator, StatusService } from '@involvemint/client/shared/util';
import { ImConfig } from '@involvemint/shared/domain';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { take } from 'rxjs/operators';

@Component({
  selector: 'login-feature-login-forgot-password-change',
  templateUrl: './forgot-password-change.component.html',
  styleUrls: ['./forgot-password-change.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordChangeComponent implements OnInit {
  readonly form = new FormGroup(
    {
      password: new FormControl(
        '',
        Validators.compose([(c) => Validators.required(c), Validators.pattern(ImConfig.regex.password.regex)])
      ),
      confirmPassword: new FormControl(
        '',
        Validators.compose([(c) => Validators.required(c), Validators.pattern(ImConfig.regex.password.regex)])
      ),
    },
    { validators: (ac) => ConfirmPasswordValidator.MatchPassword(ac, 'password', 'confirmPassword') }
  );

  email!: string;
  hash!: string;

  readonly pwdValidationText = ImConfig.regex.password.text;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly route: RouteService,
    private readonly userClient: UserRestClient,
    private readonly status: StatusService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async ({ email, hash }) => {
      this.email = email;
      this.hash = hash;
    });
  }

  back() {
    return this.route.back(() => this.route.to.login.ROOT({ animation: 'back' }));
  }

  async submit() {
    await this.status.showLoader();
    try {
      await this.userClient
        .forgotPasswordChange({}, { email: this.email, hash: this.hash, password: this.form.value.password })
        .pipe(take(1))
        .toPromise();
      await this.status.dismissLoader();
      await this.status.presentSuccess();
      await this.back();
    } catch (e) {
      await this.status.dismissLoader();
      await this.status.presentAlert({
        title: 'Error changing Password request:',
        description: e.error.message,
      });
    }
  }
}
