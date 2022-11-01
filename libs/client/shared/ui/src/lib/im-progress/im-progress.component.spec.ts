import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { ImProgressComponent } from './im-progress.component';

describe('ImProgressComponent', () => {
  let spectator: Spectator<ImProgressComponent>;
  const createComponent = createComponentFactory(ImProgressComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
