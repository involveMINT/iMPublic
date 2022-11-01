import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PoiComponent } from './poi.component';

describe.skip('PoiComponent', () => {
  let spectator: Spectator<PoiComponent>;
  const createComponent = createComponentFactory(PoiComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
