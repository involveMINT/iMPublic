import { IonicModule } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ImagesViewerModalComponent } from './images-viewer-modal.component';

/*
To debug:
node --inspect-brk ./node_modules/@angular/cli/bin/ng test frontend-shared-modals
*/

describe.skip('ImagesViewerModalComponent', () => {
  let spectator: Spectator<ImagesViewerModalComponent>;
  const createComponent = createComponentFactory({
    component: ImagesViewerModalComponent,
    imports: [IonicModule],
  });

  // beforeEach(() => {});

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
    expect(spectator.queryAll('ion-slide').length).toBe(0);
  });

  it('should show multiple slides slide', async () => {
    spectator = createComponent({ props: { imagesFilePaths: ['', '', ''] } });

    expect(spectator.queryAll('ion-slide').length).toBe(3);
  });
});
