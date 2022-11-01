import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { EpOnboardingComponent } from './ep-onboarding.component';

describe.skip('EpOnboardingComponent', () => {
  let spectator: Spectator<EpOnboardingComponent>;
  const createComponent = createComponentFactory(EpOnboardingComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
