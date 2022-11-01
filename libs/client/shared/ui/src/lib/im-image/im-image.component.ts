import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Component({
  selector: 'im-image',
  templateUrl: './im-image.component.html',
  styleUrls: ['./im-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImImageComponent {
  @Input() imgUrl?: string | null;
  @Input() set disable(disabled: boolean) {
    if (disabled) {
      this.filter = 'opacity(0.4)';
      this.cursor = '';
      this.disabled = true;
    } else {
      this.filter = 'opacity(1)';
      this.cursor = 'pointer';
      this.disabled = false;
    }
  }

  disabled = false;

  @HostBinding('style.filter') filter = 'opacity(1)';
  cursor = 'pointer';

  @Output() imgClick = new EventEmitter<string>();
  @Output() uploadImg = new EventEmitter<Event>();
  @Output() deleteImg = new EventEmitter<void>();
}
