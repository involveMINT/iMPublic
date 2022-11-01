import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ApplicationComponent } from './application.component';

describe.skip('ApplicationComponent', () => {
  let spectator: Spectator<ApplicationComponent>;
  const createComponent = createComponentFactory(ApplicationComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
