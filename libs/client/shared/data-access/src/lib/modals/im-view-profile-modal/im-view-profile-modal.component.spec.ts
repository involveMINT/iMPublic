import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ImViewProfileModalComponent } from './im-view-profile-modal.component';

describe.skip('ImViewProfileModalComponent', () => {
  let spectator: Spectator<ImViewProfileModalComponent>;
  const createComponent = createComponentFactory(ImViewProfileModalComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
