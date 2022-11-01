import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { VerifyEmailComponent } from './verify-email.component';

describe.skip('VerifyEmailComponent', () => {
  let spectator: Spectator<VerifyEmailComponent>;
  const createComponent = createComponentFactory(VerifyEmailComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
