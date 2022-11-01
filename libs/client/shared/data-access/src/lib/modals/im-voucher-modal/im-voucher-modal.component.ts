import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { VoucherStoreModel } from '../../+state/vouchers/vouchers.reducer';

export interface ImVoucherModalInputs {
  voucher: VoucherStoreModel;
}

@Component({
  selector: 'im-voucher-modal',
  templateUrl: './im-voucher-modal.component.html',
  styleUrls: ['./im-voucher-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImVoucherModalComponent implements ImVoucherModalInputs {
  voucher!: VoucherStoreModel;

  constructor(private readonly modal: ModalController) {}

  close() {
    this.modal.dismiss();
  }
}
