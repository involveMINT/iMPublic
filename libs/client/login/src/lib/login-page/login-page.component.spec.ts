import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserFacade } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { ImFormsModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { EMPTY, Subject } from 'rxjs';
import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
  let spectator: Spectator<LoginPageComponent>;

  let uf: UserFacade;

  let emailInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let submitButton: HTMLIonButtonElement;

  const loginError$ = new Subject<{ error: Error }>(); //

  const createComponent = createComponentFactory({
    component: LoginPageComponent,
    imports: [IonicModule, FormsModule, ReactiveFormsModule, ImFormsModule],
    mocks: [RouteService],
    providers: [
      mockProvider(UserFacade, {
        session: {
          actionListeners: { login: { success: EMPTY, error: loginError$ } },
          dispatchers: { login: jest.fn() },
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.component.loginForm.setErrors({ d: true });

    uf = spectator.inject(UserFacade);

    emailInput = spectator.query('[formControlName="email"]') as HTMLInputElement;
    passwordInput = spectator.query('[formControlName="password"]') as HTMLInputElement;
    submitButton = spectator.query('[test-attr="login-submit-button"]') as HTMLIonButtonElement;
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have 2 inputs and they are named correctly', () => {
    expect(emailInput).toBeTruthy();
    expect(emailInput.type).toBe('email');

    expect(passwordInput).toBeTruthy();
    expect(passwordInput.type).toBe('password');
  });

  it('should have a 2 buttons', async () => {
    expect(submitButton).toBeTruthy();
    expect(submitButton).toHaveText('Log In');
  });

  it('should disabled submit button on start up', () => {
    expect(submitButton.disabled).toBeTruthy();
  });

  it('should have button disabled when email is invalid regex', () => {
    spectator.typeInElement('bad@email', emailInput);
    spectator.typeInElement('goodPassword!0', passwordInput);
    expect(submitButton.disabled).toBeTruthy();
  });

  it('should have button disabled when email is empty', () => {
    spectator.typeInElement('', emailInput);
    spectator.typeInElement('goodPassword!0', passwordInput);
    expect(submitButton.disabled).toBeTruthy();
  });

  it('should have button disabled when password is invalid regex', () => {
    spectator.typeInElement('good@email.com', emailInput);
    spectator.typeInElement('', passwordInput);
    expect(submitButton.disabled).toBeTruthy();
  });

  it('should have button enabled when email and password are valid regex', () => {
    spectator.typeInElement('good@email.com', emailInput);
    spectator.typeInElement('goodPassword!0', passwordInput);
    expect(submitButton.disabled).toBeFalsy();
  });

  it('shows error message', () => {
    const loginErrorMsg = 'login error';
    loginError$.next({ error: new Error(loginErrorMsg) });
    spectator.detectChanges();
    expect(spectator.query('.error-msg')).toHaveText(loginErrorMsg);
  });

  it('logs in when submit button pressed', () => {
    spectator.typeInElement('good@email.com', emailInput);
    spectator.typeInElement('goodPassword!0', passwordInput);
    spectator.click(submitButton);
    expect(uf.session.dispatchers.login).toHaveBeenCalled();
  });
});
