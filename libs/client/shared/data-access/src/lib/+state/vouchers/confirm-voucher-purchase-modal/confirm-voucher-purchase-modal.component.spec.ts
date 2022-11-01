import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ConfirmVoucherPurchaseModalComponent } from './confirm-voucher-purchase-modal.component';

describe.skip('ConfirmVoucherPurchaseModalComponent', () => {
  let spectator: Spectator<ConfirmVoucherPurchaseModalComponent>;
  const createComponent = createComponentFactory(ConfirmVoucherPurchaseModalComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
