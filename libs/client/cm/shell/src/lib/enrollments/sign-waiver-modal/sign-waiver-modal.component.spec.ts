import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SignWaiverModalComponent } from './sign-waiver-modal.component';

describe.skip('SignWaiverModalComponent', () => {
  let spectator: Spectator<SignWaiverModalComponent>;
  const createComponent = createComponentFactory(SignWaiverModalComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
