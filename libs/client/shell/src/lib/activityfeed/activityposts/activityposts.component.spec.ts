import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PoisComponent } from './activityposts.component';

describe.skip('PoisComponent', () => {
  let spectator: Spectator<PoisComponent>;
  const createComponent = createComponentFactory(PoisComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
