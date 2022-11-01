import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RequestComponent } from './request.component';

describe.skip('RequestComponent', () => {
  let spectator: Spectator<RequestComponent>;
  const createComponent = createComponentFactory(RequestComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
