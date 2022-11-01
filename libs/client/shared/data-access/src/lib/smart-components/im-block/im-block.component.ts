import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  ViewChild,
} from '@angular/core';
import { animationFrameScheduler } from 'rxjs';
import { ImImagesViewerModalService } from '../../modals/im-images-viewer-modal/im-images-viewer-modal.service';

@Component({
  selector: 'im-block',
  templateUrl: './im-block.component.html',
  styleUrls: ['./im-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImBlockComponent implements AfterViewInit {
  @Input() set images(image: string[] | string | undefined) {
    this.imagesFormatted = (Array.isArray(image) ? image : [image]) as string[];
  }
  @Input() title?: string | null;
  @Input() showHeader = true;
  @Input() collapsible = false;
  @Input() collapsed = false;
  @Input() set imageSlot(imageSlot: 'left' | 'top') {
    if (imageSlot === 'left') {
      this.imageLeft = true;
      this.imageTop = false;
    } else {
      this.imageLeft = false;
      this.imageTop = true;
    }
  }
  @Input() icon?: string | null;
  @Input() set join(join: boolean) {
    this.classJoin = join;
  }

  @HostBinding('class.join') classJoin = false;
  @HostBinding('class.image-left') imageLeft = false;
  @HostBinding('class.image-top') imageTop = true;
  @HostBinding('style.cursor') cursor = '';

  @ViewChild('headerWrapper') header?: ElementRef<HTMLDivElement>;
  @ViewChild('bodyWrapper') body?: ElementRef<HTMLDivElement>;

  imagesFormatted: string[] = [];

  imageUrls: string[] = [];

  width = 0;

  constructor(
    private readonly imagesViewer: ImImagesViewerModalService,
    private readonly change: ChangeDetectorRef,
    public readonly el: ElementRef
  ) {}

  ngAfterViewInit() {
    if (this.header?.nativeElement.children.length === 0 && !this.collapsible) {
      this.showHeader = false;
    }
    if (this.body?.nativeElement.children.length === 0) {
      this.collapsed = true;
    }
    animationFrameScheduler.schedule(() => {
      this.width = this.el.nativeElement.offsetHeight;
      this.change.detectChanges();
    }, 1);
  }

  async viewImages() {
    await this.imagesViewer.open({ imagesFilePaths: this.imagesFormatted });
  }

  toggleCollapse() {
    if (!this.collapsible) {
      return;
    }

    this.collapsed = !this.collapsed;
    this.change.detectChanges();
  }
}
