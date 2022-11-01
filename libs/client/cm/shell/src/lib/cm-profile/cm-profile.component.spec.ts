import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { CmProfileComponent } from './my-cm-profile.component';

describe.skip('CmProfileComponent', () => {
  let spectator: Spectator<CmProfileComponent>;
  const createComponent = createComponentFactory(CmProfileComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
