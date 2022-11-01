import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ImBlockComponent } from './im-block.component';

describe.skip('ImBlockComponent', () => {
  let spectator: Spectator<ImBlockComponent>;
  const createComponent = createComponentFactory(ImBlockComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
