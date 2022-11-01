import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RequestCoverComponent } from './request-cover.component';

describe.skip('RequestCoverComponent', () => {
  let spectator: Spectator<RequestCoverComponent>;
  const createComponent = createComponentFactory(RequestCoverComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
