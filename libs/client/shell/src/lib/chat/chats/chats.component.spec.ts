import { UserFacade } from '@involvemint/frontend/shared/data-access';
import { RoutesService } from '@involvemint/frontend/shared/routes';
import { IonicModule } from '@ionic/angular';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { EMPTY } from 'rxjs';
import { ChatsComponent } from './chats.component';

describe.skip('ChatsComponent', () => {
  let spectator: Spectator<ChatsComponent>;
  const createComponent = createComponentFactory({
    component: ChatsComponent,
    imports: [IonicModule],
    mocks: [RoutesService],
    providers: [
      // mockProvider(ChatService, { getMyChats: () => EMPTY }),
      mockProvider(UserFacade, { session: { selectors: { activeAccount$: EMPTY } } }),
    ],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
