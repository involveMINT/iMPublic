import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { BudgetComponent } from './budget.component';

describe.skip('BudgetComponent', () => {
  let spectator: Spectator<BudgetComponent>;
  const createComponent = createComponentFactory(BudgetComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
