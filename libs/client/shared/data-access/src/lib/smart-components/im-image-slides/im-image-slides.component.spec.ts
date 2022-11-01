import { IonicModule } from '@ionic/angular';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';
import { ImImageSlidesComponent } from './im-image-slides.component';

describe.skip('ImImageSlidesComponent', () => {
  let spectator: SpectatorHost<ImImageSlidesComponent>;

  const createHost = createHostFactory({
    component: ImImageSlidesComponent,
    imports: [IonicModule],
  });

  it('should create', () => {
    spectator = createHost(`<im-image-slides></im-image-slides>`);
    expect(spectator.component).toBeTruthy();
  });

  it('should show no slides', () => {
    spectator = createHost(
      `<im-image-slides [imagesFilePaths]="[]">im-image-slides content</im-image-slides>`
    );
    expect(spectator.queryAll('ion-slide').length).toBe(0);
  });

  it('should show 3 slides', () => {
    spectator = createHost(
      `<im-image-slides [imagesFilePaths]="['','','']">im-image-slides content</im-image-slides>`
    );
    expect(spectator.queryAll('ion-slide').length).toBe(3);
  });
});
