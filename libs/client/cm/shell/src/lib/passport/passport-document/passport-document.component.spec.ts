import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PassportDocumentComponent } from './passport-document.component';

describe.skip('PassportDocumentComponent', () => {
  let spectator: Spectator<PassportDocumentComponent>;
  const createComponent = createComponentFactory(PassportDocumentComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
