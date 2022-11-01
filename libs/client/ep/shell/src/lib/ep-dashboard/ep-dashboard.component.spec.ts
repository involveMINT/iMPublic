import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { EpDashboardComponent } from './ep-dashboard.component';

describe.skip('EpDashboardComponent', () => {
  let spectator: Spectator<EpDashboardComponent>;
  const createComponent = createComponentFactory(EpDashboardComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
