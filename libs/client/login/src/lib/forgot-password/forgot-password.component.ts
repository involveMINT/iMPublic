import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { UserRestClient } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatefulComponent, StatusService } from '@involvemint/client/shared/util';
import { ImConfig } from '@involvemint/shared/domain';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { catchError, take, tap } from 'rxjs/operators';

@Component({
  selector: 'login-feature-login-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent extends StatefulComponent {
  readonly form = new FormGroup({
    email: new FormControl(
      '',
      Validators.compose([(c) => Validators.required(c), Validators.pattern(ImConfig.regex.email)])
    ),
  });

  constructor(
    private readonly route: RouteService,
    private readonly userClient: UserRestClient,
    private readonly status: StatusService
  ) {
    super({});
  }

  back() {
    return this.route.back(() => this.route.to.login.ROOT({ animation: 'back' }));
  }

  async submit() {
    await this.status.showLoader();
    this.userClient
      .forgotPassword({}, { email: this.form.value.email })
      .pipe(
        take(1),
        tap(async () => {
          await this.status.dismissLoader();
          await this.status.presentSuccess();
          await this.route.to.login.ROOT();
        }),
        catchError(async (error) => {
          await this.status.dismissLoader();
          await this.status.presentAlert({
            title: 'Error submitting Forgot Password request:',
            description: error.error.message,
          });
        })
      )
      .subscribe();
  }
}
