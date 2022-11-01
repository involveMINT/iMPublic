import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SpSettingsComponent } from './sp-settings.component';

describe.skip('SpSettingsComponent', () => {
  let spectator: Spectator<SpSettingsComponent>;
  const createComponent = createComponentFactory(SpSettingsComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
