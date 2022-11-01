import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { EpCoverComponent } from './ep-cover.component';

describe.skip('EpCoverComponent', () => {
  let spectator: Spectator<EpCoverComponent>;
  const createComponent = createComponentFactory(EpCoverComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
