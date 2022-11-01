import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ImLegalModalComponent } from './im-legal-modal.component';

describe.skip('ImLegalModalComponent', () => {
  let spectator: Spectator<ImLegalModalComponent>;
  const createComponent = createComponentFactory(ImLegalModalComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
