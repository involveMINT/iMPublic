import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatService, UserFacade } from '@involvemint/frontend/shared/data-access';
import { RoutesService } from '@involvemint/frontend/shared/routes';
import { IonicModule } from '@ionic/angular';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { EMPTY } from 'rxjs';
import { ChatComponent } from './chat.component';

describe.skip('ChatComponent', () => {
  let spectator: Spectator<ChatComponent>;
  const createComponent = createComponentFactory({
    component: ChatComponent,
    imports: [IonicModule, FormsModule, ReactiveFormsModule],
    mocks: [RoutesService],
    providers: [
      mockProvider(ActivatedRoute, { snapshot: { paramMap: { get: () => 'id' } } }),
      mockProvider(ChatService, { get: () => EMPTY }),
      mockProvider(UserFacade, { session: { selectors: { activeAccount$: EMPTY } } }),
    ],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
