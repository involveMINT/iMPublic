import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SpAdminsComponent } from './sp-admins.component';

describe.skip('SpAdminsComponent', () => {
  let spectator: Spectator<SpAdminsComponent>;
  const createComponent = createComponentFactory(SpAdminsComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
