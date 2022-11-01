import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ImHandleComponent } from './im-handle.component';

describe.skip('ImHandleComponent', () => {
  let spectator: Spectator<ImHandleComponent>;
  const createComponent = createComponentFactory(ImHandleComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
