import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { OfferCoverComponent } from './offer-cover.component';

describe.skip('OfferCoverComponent', () => {
  let spectator: Spectator<OfferCoverComponent>;
  const createComponent = createComponentFactory(OfferCoverComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
