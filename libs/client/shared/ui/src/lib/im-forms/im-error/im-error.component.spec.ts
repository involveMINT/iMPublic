import { IonicModule } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ImErrorComponent } from './im-error.component';

describe.skip('ImErrorComponent', () => {
  let spectator: Spectator<ImErrorComponent>;
  const createComponent = createComponentFactory({
    component: ImErrorComponent,
    imports: [IonicModule],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
