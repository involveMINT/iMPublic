import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PassportComponent } from './passport.component';

describe.skip('PassportComponent', () => {
  let spectator: Spectator<PassportComponent>;
  const createComponent = createComponentFactory(PassportComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
