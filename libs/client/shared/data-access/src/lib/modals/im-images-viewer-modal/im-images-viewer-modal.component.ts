import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import Swiper, { SwiperOptions } from 'swiper';

export interface ImagesViewerComponentInputs {
  imagesFilePaths: string[];
  slideIndex?: number;
}

@Component({
  selector: 'im-images-viewer-modal',
  templateUrl: './im-images-viewer-modal.component.html',
  styleUrls: ['./im-images-viewer-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImImagesViewerModalComponent implements ImagesViewerComponentInputs {
  @Input() imagesFilePaths: string[] = [];
  @Input() slideIndex = 0;

  @ViewChild('slides') slides!: IonSlides;

  sliderOptions: SwiperOptions = {
    zoom: true,
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 20,
    passiveListeners: false,
  };

  constructor(private readonly _modal: ModalController, private readonly change: ChangeDetectorRef) {}

  slidesLoaded() {
    // Fixes a weird bug where the slides don't work correctly
    this.slides.update();
    this.slides.slideTo(this.slideIndex, 0);
  }

  onMouseWheel(event: WheelEvent): void {
    event.preventDefault();
    const swiper: Swiper = ((this.slides as unknown) as { el: { swiper: Swiper } }).el.swiper;
    const zoom = swiper.zoom;
    if (zoom) {
      if (event.deltaY < 0) {
        zoom.in();
      } else {
        zoom.out();
      }
    }
  }

  back() {
    this.slides.slidePrev();
  }

  forward() {
    this.slides.slideNext();
  }

  close(): void {
    this._modal.dismiss();
  }

  async slidesChanged() {
    this.slideIndex = await this.slides.getActiveIndex();
    this.change.detectChanges();
  }
}
