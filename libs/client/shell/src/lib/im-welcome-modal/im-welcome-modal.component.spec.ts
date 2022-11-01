import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { ImWelcomeModalComponent } from './im-welcome-modal.component';

describe('ImWelcomeModalComponent', () => {
  let spectator: Spectator<ImWelcomeModalComponent>;
  const createComponent = createComponentFactory(ImWelcomeModalComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
