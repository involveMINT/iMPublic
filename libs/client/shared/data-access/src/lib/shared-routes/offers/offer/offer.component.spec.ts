import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { OfferComponent } from './offer.component';

describe.skip('OfferComponent', () => {
  let spectator: Spectator<OfferComponent>;
  const createComponent = createComponentFactory(OfferComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
