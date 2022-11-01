import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { WalletComponent } from './wallet.component';

describe.skip('WalletComponent', () => {
  let spectator: Spectator<WalletComponent>;
  const createComponent = createComponentFactory(WalletComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
