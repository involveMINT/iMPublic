import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ImVoucherModalComponent } from './im-voucher-modal.component';

describe.skip('ImVoucherModalComponent', () => {
  let spectator: Spectator<ImVoucherModalComponent>;
  const createComponent = createComponentFactory(ImVoucherModalComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
