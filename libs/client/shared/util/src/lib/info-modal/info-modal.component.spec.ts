import { IonicModule } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { InfoModalComponent } from './info-modal.component';

describe.skip('InfoModalComponent', () => {
  let spectator: Spectator<InfoModalComponent>;
  const createComponent = createComponentFactory({
    component: InfoModalComponent,
    imports: [IonicModule],
  });

  it('should create', () => {
    spectator = createComponent({ props: { icon: { name: '', source: 'ionicon' } } });

    expect(spectator.component).toBeTruthy();
  });
});
