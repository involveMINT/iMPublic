import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PassportModalComponent } from './passport-modal.component';

describe.skip('PassportModalComponent', () => {
  let spectator: Spectator<PassportModalComponent>;
  const createComponent = createComponentFactory(PassportModalComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
