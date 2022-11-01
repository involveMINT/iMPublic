import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ImOfferModule } from '../im-offer/im-offer.module';
import { ImVoucherInfoComponent } from './im-voucher-info.component';

describe.skip('ImVoucherInfoComponent', () => {
  let spectator: Spectator<ImVoucherInfoComponent>;
  const createComponent = createComponentFactory({
    component: ImVoucherInfoComponent,
    imports: [CommonModule, IonicModule, ImOfferModule],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
