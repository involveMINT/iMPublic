import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserFacade } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { ImConfig } from '@involvemint/shared/domain';
import { tap } from 'rxjs/operators';

interface State {
  errorStatus: string;
}

@Component({
  selector: 'login-feature-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['../styles/form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent extends StatefulComponent<State> implements OnInit {
  readonly loginForm = new FormGroup({
    email: new FormControl('', [(c) => Validators.required(c), Validators.pattern(ImConfig.regex.email)]),
    password: new FormControl('', (c) => Validators.required(c)),
  });

  constructor(private readonly route: RouteService, private readonly user: UserFacade) {
    super({ errorStatus: '' });
  }

  ngOnInit(): void {
    this.effect(() =>
      this.user.session.actionListeners.login.success.pipe(
        tap(() => {
          this.updateState({ errorStatus: '' });
        })
      )
    );

    this.effect(() =>
      this.user.session.actionListeners.login.error.pipe(
        tap(({ error }) => {
          this.updateState({ errorStatus: error.message });
        })
      )
    );
  }

  async signUp(): Promise<void> {
    await this.route.to.signUp.ROOT({ animation: 'forward' });
    this.updateState({ errorStatus: '' });
  }

  async submit(): Promise<void> {
    this.updateState({ errorStatus: '' });

    const { email, password } = this.loginForm.value;

    if (email.trim() === ImConfig.adminEmail) {
      this.user.session.dispatchers.loginAdmin(password);
    } else {
      this.user.session.dispatchers.login(email, password);
    }
  }

  // doGoogleLogin(): void {
  //   this.updateState({ errorStatus: '' });
  //   this.uf.session.dispatchers.googleSignIn(environment.authPersistance);
  // }

  async forgotPassword() {
    return this.route.to.forgotPassword.ROOT({ animation: 'back' });
  }
}
