import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ImInitLoaderComponent } from './im-init-loader.component';

describe.skip('ImInitLoaderComponent', () => {
  let spectator: Spectator<ImInitLoaderComponent>;
  const createComponent = createComponentFactory(ImInitLoaderComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
