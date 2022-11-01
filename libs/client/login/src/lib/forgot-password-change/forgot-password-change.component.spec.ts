import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserFacade } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { ImFormsModule } from '@involvemint/client/shared/ui';
import { StatusService } from '@involvemint/client/shared/util';
import { IonicModule } from '@ionic/angular';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { EMPTY } from 'rxjs';
import { ForgotPasswordChangeComponent } from './forgot-password-change.component';

describe.skip('ForgotPasswordChangeComponent', () => {
  let spectator: Spectator<ForgotPasswordChangeComponent>;
  const createComponent = createComponentFactory({
    component: ForgotPasswordChangeComponent,
    imports: [IonicModule, FormsModule, ReactiveFormsModule, ImFormsModule],
    mocks: [StatusService, RouteService],
    providers: [
      mockProvider(UserFacade, { session: { actionListeners: { forgotPassword: { success: EMPTY } } } }),
    ],
  });

  it('should create', () => {
    spectator = createComponent();
    expect(spectator.component).toBeTruthy();
  });
});
