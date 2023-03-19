import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PoisComponent } from './activityposts.component';
import { IonicModule } from '@ionic/angular';
import { ImBlockComponent } from 'libs/client/shared/data-access/src/lib/smart-components/im-block/im-block.component';

fdescribe('Activity Posts Component', () => {
  let spectator: Spectator<PoisComponent>;
  const createComponent = createComponentFactory(
    {
      component: PoisComponent, 
      imports: [IonicModule.forRoot()],
      declarations: [ImBlockComponent],
      });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
