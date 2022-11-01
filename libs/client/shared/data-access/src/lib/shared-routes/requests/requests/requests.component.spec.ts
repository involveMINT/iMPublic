import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RequestsComponent } from './requests.component';

describe.skip('RequestsComponent', () => {
  let spectator: Spectator<RequestsComponent>;
  const createComponent = createComponentFactory(RequestsComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
