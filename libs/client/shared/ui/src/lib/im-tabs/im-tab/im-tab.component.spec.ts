import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { IonicModule } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ImTabComponent } from './im-tab.component';

describe.skip('ImTabComponent', () => {
  let spectator: Spectator<ImTabComponent>;
  const createComponent = createComponentFactory({
    component: ImTabComponent,
    imports: [IonicModule, SuperTabsModule],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
