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
  selector: 'login-feature-login-activate-user-account',
  templateUrl: './activate-user-account.component.html',
  styleUrls: ['./activate-user-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivateUserAccountComponent implements OnInit {
  email!: string;
  epId!: string;
  activationHash!: string;
  temporaryPassword!: string;
  forgotPasswordHash!: string;

  readonly form = new FormGroup(
    {
      email: new FormControl(this.email),
      newPassword: new FormControl(
        '',
        Validators.compose([(c) => Validators.required(c), Validators.pattern(ImConfig.regex.password.regex)])
      ),
      confirmNewPassword: new FormControl(
        '',
        Validators.compose([(c) => Validators.required(c), Validators.pattern(ImConfig.regex.password.regex)])
      ),
    },
    { validators: (ac) => ConfirmPasswordValidator.MatchPassword(ac, 'newPassword', 'confirmNewPassword') }
  );

  readonly pwdValidationText = ImConfig.regex.password.text;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly route: RouteService,
    private readonly userClient: UserRestClient,
    private readonly status: StatusService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
      async ({ email, epId, activationHash, temporaryPassword, forgotPasswordHash }) => {
        this.form.controls['email'].setValue(email);
        this.email = email;
        this.epId = epId;
        this.activationHash = activationHash;
        this.temporaryPassword = temporaryPassword;
        this.forgotPasswordHash = forgotPasswordHash;
      }
    );
  }

  back() {
    return this.route.to.login.ROOT({
      animation: 'forward',
      replaceUrl: true,
      queryParams: {
        email: undefined,
        epId: undefined,
        activationHash: undefined,
        temporaryPassword: undefined,
        forgotPasswordHash: undefined,
      },
    });
  }

  async submit() {
    await this.status.showLoader();
    try {
      await this.userClient
        .activateUserAccount(
          {},
          {
            email: this.email,
            epId: this.epId,
            activationHash: this.activationHash,
            temporaryPassword: this.temporaryPassword,
            forgotPasswordHash: this.forgotPasswordHash,
            newPassword: this.form.value.newPassword,
          }
        )
        .pipe(take(1))
        .toPromise();
      await this.status.dismissLoader();
      await this.status.presentAlert({
        title: 'Account Activated',
        description: 'Account activated with new password set. Please login with your new password',
      });
      await this.back();
    } catch (e) {
      await this.status.dismissLoader();
      await this.status.presentAlert({
        title: 'Error activating account and setting password:',
        description: e.error.message,
      });
    }
  }
}
