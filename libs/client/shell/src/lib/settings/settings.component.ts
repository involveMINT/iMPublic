import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { UserFacade, UserSessionState } from '@involvemint/client/shared/data-access';
import { ConfirmPasswordValidator, StatefulComponent } from '@involvemint/client/shared/util';
import { ImConfig } from '@involvemint/shared/domain';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';

/*
  TODO: Refactor component's name to Preferences.
*/

interface State {
  authenticated: boolean;
  darkMode: boolean;
  navTabs: boolean;
  isAdmin: boolean;
  sideMenuBehavior: UserSessionState['sideMenuBehavior'];
}

@Component({
  selector: 'involvemint-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent extends StatefulComponent<State> implements OnInit {
  readonly changePasswordForm = new FormGroup(
    {
      currentPassword: new FormControl('', (e) => Validators.required(e)),
      newPassword: new FormControl('', [
        (e) => Validators.required(e),
        Validators.pattern(ImConfig.regex.password.regex),
      ]),
      confirmPassword: new FormControl('', [
        (e) => Validators.required(e),
        Validators.pattern(ImConfig.regex.password.regex),
      ]),
    },
    { validators: (ac) => ConfirmPasswordValidator.MatchPassword(ac, 'newPassword', 'confirmPassword') }
  );

  readonly pwdValidationText = ImConfig.regex.password.text;

  constructor(private readonly user: UserFacade) {
    super({
      authenticated: false,
      darkMode: false,
      navTabs: true,
      isAdmin: false,
      sideMenuBehavior: 'hidden',
    });
  }

  ngOnInit(): void {
    const theme = localStorage.getItem('theme');
    this.state.darkMode = theme === 'dark';

    this.effect(() =>
      this.user.session.selectors.authenticated$.pipe(
        tap((authenticated) => this.updateState({ authenticated }))
      )
    );

    this.effect(() =>
      this.user.session.selectors.isAdmin$.pipe(tap((isAdmin) => this.updateState({ isAdmin })))
    );

    this.effect(() =>
      this.user.session.selectors.sideMenuBehavior$.pipe(
        tap((sideMenuBehavior) => this.updateState({ sideMenuBehavior }))
      )
    );

    this.effect(() =>
      this.user.session.selectors.navTabs$.pipe(tap((navTabs) => this.updateState({ navTabs })))
    );

    this.effect(() =>
      merge(
        this.user.session.actionListeners.changePassword.success,
        this.user.session.actionListeners.changePassword.error
      ).pipe(tap(() => this.changePasswordForm.reset()))
    );
  }

  logout() {
    this.user.session.dispatchers.logout();
  }

  onDarkModeChange() {
    this.updateState({ darkMode: !this.state.darkMode });
    if (this.state.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }

  onNavTabChange() {
    this.user.session.dispatchers.toggleNavTabs(!this.state.navTabs);
  }

  sideMenuBehavior() {
    this.user.session.dispatchers.toggleSideMenuBehavior(
      this.state.sideMenuBehavior === 'hidden' ? 'responsive' : 'hidden'
    );
  }

  changePassword() {
    this.user.session.dispatchers.changePassword({
      currentPassword: this.changePasswordForm.value.currentPassword,
      newPassword: this.changePasswordForm.value.newPassword,
    });
  }
}
