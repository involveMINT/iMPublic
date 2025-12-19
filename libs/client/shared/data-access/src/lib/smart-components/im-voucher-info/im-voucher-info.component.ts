import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import { calculateVoucherStatus, Voucher, VoucherStatus, IParser } from '@involvemint/shared/domain';
import { ImImagesViewerModalService } from '../../modals/im-images-viewer-modal/im-images-viewer-modal.module';

type VoucherStoreModel = IParser<
  Voucher,
  {
    id: true;
    amount: true;
    code: true;
    dateArchived: true;
    dateCreated: true;
    dateExpires: true;
    dateRedeemed: true;
    dateRefunded: true;
    seller: { id: true; handle: { id: true }; name: true };
    changeMakerReceiver: { id: true; handle: { id: true }; profilePicFilePath: true };
    exchangePartnerReceiver: { id: true; handle: { id: true }; logoFilePath: true };
    servePartnerReceiver: { id: true; handle: { id: true }; logoFilePath: true };
    offers: {
      id: true;
      quantity: true;
      offer: {
        name: true;
        price: true;
        imagesFilePaths: true;
        listingStatus: true;
        description: true;
      };
    };
  }
>;

@Component({
  selector: 'im-voucher-info',
  templateUrl: './im-voucher-info.component.html',
  styleUrls: ['./im-voucher-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImVoucherInfoComponent<T extends VoucherStoreModel> implements OnChanges {
  @Input() voucher!: T;

  get VoucherStatus() {
    return VoucherStatus;
  }

  status: VoucherStatus | null = null;

  constructor(
    private readonly imagesViewer: ImImagesViewerModalService,
    private readonly change: ChangeDetectorRef
  ) {}

  ngOnChanges(): void {
    this.status = calculateVoucherStatus(this.voucher);
    this.change.detectChanges();
  }

  getOwnerProfilePicture(voucher: T) {
    return voucher.changeMakerReceiver
      ? voucher.changeMakerReceiver.profilePicFilePath
      : voucher.exchangePartnerReceiver
      ? voucher.exchangePartnerReceiver.logoFilePath
      : voucher.servePartnerReceiver
      ? voucher.servePartnerReceiver.logoFilePath
      : undefined;
  }

  async viewImages(imagesFilePaths: string[]) {
    await this.imagesViewer.open({ imagesFilePaths });
  }
}
