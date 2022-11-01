import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { IonicModule } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ImTabsComponent } from './im-tabs.component';

describe.skip('ImTabsComponent', () => {
  let spectator: Spectator<ImTabsComponent>;
  const createComponent = createComponentFactory({
    component: ImTabsComponent,
    imports: [IonicModule, SuperTabsModule],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
