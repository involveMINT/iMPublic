import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { ImImagesViewerModalService } from '../../modals/im-images-viewer-modal/im-images-viewer-modal.service';

export interface ImImagesSlidesImageClicked {
  imagesFilePaths: string[];
  slideIndex: number;
}

@Component({
  selector: 'im-image-slides',
  templateUrl: './im-image-slides.component.html',
  styleUrls: ['./im-image-slides.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImImageSlidesComponent {
  @Input() set images(image: string[] | string | undefined) {
    this.imagesFormatted = (Array.isArray(image) ? image : [image]) as string[];
  }
  imagesFormatted: string[] = [];

  readonly slidesOptions: SwiperOptions = {
    slidesPerView: 2,
    spaceBetween: 1,
    centeredSlides: true,
  };

  constructor(private readonly imagesViewer: ImImagesViewerModalService) {}

  async viewImages(index: number) {
    await this.imagesViewer.open({ imagesFilePaths: this.imagesFormatted, slideIndex: index });
  }
}
