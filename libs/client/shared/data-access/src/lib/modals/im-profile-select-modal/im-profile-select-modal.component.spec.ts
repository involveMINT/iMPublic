import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ImProfileSelectModalComponent } from './im-profile-select-modal.component';

describe.skip('ImProfileSelectModalComponent', () => {
  let spectator: Spectator<ImProfileSelectModalComponent>;
  const createComponent = createComponentFactory(ImProfileSelectModalComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
