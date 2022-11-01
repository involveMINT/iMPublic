import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { OffersComponent } from './offers.component';

describe.skip('OffersComponent', () => {
  let spectator: Spectator<OffersComponent>;
  const createComponent = createComponentFactory(OffersComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
