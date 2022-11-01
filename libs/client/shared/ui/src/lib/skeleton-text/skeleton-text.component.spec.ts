import { IonicModule } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SkeletonTextComponent } from './skeleton-text.component';

describe.skip('SkeletonTextComponent', () => {
  let spectator: Spectator<SkeletonTextComponent>;
  const createComponent = createComponentFactory({
    component: SkeletonTextComponent,
    imports: [IonicModule],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
