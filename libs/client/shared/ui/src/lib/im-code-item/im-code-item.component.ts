import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'im-code-item',
  templateUrl: './im-code-item.component.html',
  styleUrls: ['./im-code-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImCodeItemComponent {
  @Input() code!: string;
  @Input() price!: number;
  @Input() active = true;
  @Input() @HostBinding('style.cursor') cursor = 'pointer';
}
