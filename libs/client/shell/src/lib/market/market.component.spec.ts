import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MarketComponent } from './market.component';

describe.skip('MarketComponent', () => {
  let spectator: Spectator<MarketComponent>;
  const createComponent = createComponentFactory(MarketComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
