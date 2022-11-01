import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserFacade } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { ImFormsModule } from '@involvemint/client/shared/ui';
import { InfoModalModule } from '@involvemint/client/shared/util';
import { IonicModule, ModalController } from '@ionic/angular';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { EMPTY, Subject } from 'rxjs';
import { SignUpComponent } from './sign-up.component';

describe.skip('SignUpComponent', () => {
  let spectator: Spectator<SignUpComponent>;

  let routesService: RouteService;
  let uf: UserFacade;

  let emailInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let confirmPasswordInput: HTMLInputElement;

  let acceptTC: HTMLIonCheckboxElement;

  let submitButton: HTMLButtonElement;
  let backButton: HTMLButtonElement;

  const signUpError$ = new Subject<{ error: Error }>();

  const createComponent = createComponentFactory({
    component: SignUpComponent,
    imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule, InfoModalModule, ImFormsModule],
    providers: [
      FormBuilder,
      ModalController,
      mockProvider(UserFacade, {
        session: {
          actionListeners: {
            signUp: { success: EMPTY, error: signUpError$ },
            login: { error: EMPTY },
          },
          dispatchers: {
            signUp: jest.fn(),
          },
        },
      }),
      mockProvider(RouteService, {}),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();

    routesService = spectator.inject(RouteService);
    uf = spectator.inject(UserFacade);

    emailInput = spectator.query('[formControlName="email"]') as HTMLInputElement;
    passwordInput = spectator.query('[formControlName="password"]') as HTMLInputElement;
    confirmPasswordInput = spectator.query('[formControlName="confirmPassword"]') as HTMLInputElement;

    acceptTC = spectator.query('im-checkbox') as HTMLIonCheckboxElement;

    backButton = spectator.query('[test-attr="sign-up-home-button"]') as HTMLButtonElement;
    submitButton = spectator.query('[test-attr="sign-up-submit-button"]') as HTMLButtonElement;
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have 3 inputs and they are named correctly', () => {
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(confirmPasswordInput).toBeTruthy();

    expect(emailInput.type).toBe('email');
    expect(passwordInput.type).toBe('password');
    expect(confirmPasswordInput.type).toBe('password');
  });

  it('should have 2 buttons button', async () => {
    expect(backButton).toBeTruthy();

    expect(submitButton).toBeTruthy();
    expect(submitButton).toHaveText('Sign Up');
  });

  it('should disabled submit button on start up', () => {
    expect(submitButton.disabled).toBeTruthy();
  });

  it('should have button disabled when email is invalid regex and TC checked', () => {
    spectator.typeInElement('bad@email', emailInput);
    spectator.typeInElement('goodPassword0!', passwordInput);
    spectator.typeInElement('goodPassword0!', confirmPasswordInput);
    spectator.click(acceptTC);
    expect(submitButton.disabled).toBeTruthy();
  });

  it('should have button disabled when passwords are same but invalid regex and TC checked', () => {
    spectator.typeInElement('good@email.com', emailInput);
    spectator.typeInElement('bad', passwordInput);
    spectator.typeInElement('bad', confirmPasswordInput);
    spectator.click(acceptTC);
    expect(submitButton.disabled).toBeTruthy();
  });

  it('should have button disabled when passwords are valid regex but not the same and TC checked', () => {
    spectator.typeInElement('good@email.com', emailInput);
    spectator.typeInElement('goodPassword0!1', passwordInput);
    spectator.typeInElement('goodPassword0!2', confirmPasswordInput);
    spectator.click(acceptTC);
    expect(submitButton.disabled).toBeTruthy();
  });

  it(`should have button disabled when email and passwords
      are valid regex and passwords are the same but accept TC checkbox not checked`, () => {
    spectator.typeInElement('good@email.com', emailInput);
    spectator.typeInElement('goodPassword0!', passwordInput);
    spectator.typeInElement('goodPassword0!', confirmPasswordInput);
    expect(submitButton.disabled).toBeTruthy();
  });

  it(`should have button enabled when email and passwords
      are valid regex and passwords are the same and TC checked`, () => {
    spectator.typeInElement('good@email.com', emailInput);
    spectator.typeInElement('goodPassword0!', passwordInput);
    spectator.typeInElement('goodPassword0!', confirmPasswordInput);
    spectator.click(acceptTC);
    expect(submitButton.disabled).toBeFalsy();
  });

  it('should go back to public home when back button clicked', async () => {
    spectator.click(backButton);
    expect(routesService.to.ROOT).toHaveBeenCalled();
  });

  it('shows error message', () => {
    const signUpErrorMsg = 'signUp error';
    signUpError$.next({ error: new Error(signUpErrorMsg) });
    spectator.detectChanges();
    expect(spectator.query('.error-msg')).toHaveText(signUpErrorMsg);
  });

  it('signs up when submit button pressed', () => {
    spectator.typeInElement('good@email.com', emailInput);
    spectator.typeInElement('goodPassword0!', passwordInput);
    spectator.typeInElement('goodPassword0!', confirmPasswordInput);
    spectator.click(submitButton);
    expect(uf.session.dispatchers.signUp).toHaveBeenCalled();
  });
});
