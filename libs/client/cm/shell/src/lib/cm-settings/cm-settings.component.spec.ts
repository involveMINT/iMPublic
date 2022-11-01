import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { CmSettingsComponent } from './cm-settings.component';

describe.skip('CmSettingsComponent', () => {
  let spectator: Spectator<CmSettingsComponent>;
  const createComponent = createComponentFactory(CmSettingsComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
