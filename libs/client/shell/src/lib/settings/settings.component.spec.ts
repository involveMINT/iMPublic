import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { SettingsComponent } from './im-settings.component';

describe.skip('SettingsComponent', () => {
  let spectator: Spectator<SettingsComponent>;
  const createComponent = createComponentFactory(SettingsComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
