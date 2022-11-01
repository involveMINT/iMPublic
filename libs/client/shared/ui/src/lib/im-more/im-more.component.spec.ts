import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ImMoreComponent } from './im-more.component';

describe.skip('ImMoreComponent', () => {
  let spectator: Spectator<ImMoreComponent>;
  const createComponent = createComponentFactory(ImMoreComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
