import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'im-more',
  templateUrl: './im-more.component.html',
  styleUrls: ['./im-more.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImMoreComponent {
  @Output() tlClick = new EventEmitter<void>();
  @Output() trClick = new EventEmitter<void>();
  @Output() blClick = new EventEmitter<void>();
  @Output() brClick = new EventEmitter<void>();
}
