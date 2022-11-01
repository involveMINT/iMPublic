import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { EnrollmentsModalComponent } from './enrollments-modal.component';

describe.skip('EnrollmentsModalComponent', () => {
  let spectator: Spectator<EnrollmentsModalComponent>;
  const createComponent = createComponentFactory(EnrollmentsModalComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
