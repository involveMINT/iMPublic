import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SwiperOptions } from 'swiper';

export interface ImImagesSlidesImageClicked {
  photoUrls: string[];
  slideIndex: number;
}

@Component({
  selector: 'im-image-slides',
  templateUrl: './im-image-slides.component.html',
  styleUrls: ['./im-image-slides.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImImageSlidesComponent {
  @Input() photoUrls: string[] = [];
  @Output() imageClicked = new EventEmitter<ImImagesSlidesImageClicked>();

  readonly slidesOptions: SwiperOptions = {
    slidesPerView: 1.5,
    spaceBetween: 20,
    centeredSlides: true,
  };

  clickedImage(slideIndex: number, photoUrls: string[]): void {
    this.imageClicked.emit({ slideIndex, photoUrls });
  }
}
