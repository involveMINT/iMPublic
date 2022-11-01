import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { EnrollmentsComponent } from './enrollments.component';

describe.skip('EnrollmentsComponent', () => {
  let spectator: Spectator<EnrollmentsComponent>;
  const createComponent = createComponentFactory(EnrollmentsComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
