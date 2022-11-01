import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ImAppComponent } from './im-app.component';

describe.skip('ImAppComponent', () => {
  let spectator: Spectator<ImAppComponent>;
  const createComponent = createComponentFactory(ImAppComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
