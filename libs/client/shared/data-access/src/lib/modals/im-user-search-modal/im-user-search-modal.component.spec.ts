import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ImProfileSearchModalComponent } from './im-profile-search-modal.component';

describe.skip('ImProfileSearchModalComponent', () => {
  let spectator: Spectator<ImProfileSearchModalComponent>;
  const createComponent = createComponentFactory(ImProfileSearchModalComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
