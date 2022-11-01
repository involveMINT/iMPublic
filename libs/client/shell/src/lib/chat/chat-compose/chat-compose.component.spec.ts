import { UserFacade } from '@involvemint/frontend/shared/data-access';
import { RoutesService } from '@involvemint/frontend/shared/routes';
import { IonicModule } from '@ionic/angular';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { EMPTY } from 'rxjs';
import { ChatComposeComponent } from './chat-compose.component';

describe.skip('ChatComposeComponent', () => {
  let spectator: Spectator<ChatComposeComponent>;
  const createComponent = createComponentFactory({
    component: ChatComposeComponent,
    imports: [IonicModule],
    mocks: [RoutesService],
    providers: [
      mockProvider(UserFacade, { session: { actionListeners: { searchHandles: { success: EMPTY } } } }),
    ],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
