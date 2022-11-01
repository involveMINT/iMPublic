import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'im-tab',
  templateUrl: './im-tab.component.html',
  styleUrls: ['./im-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImTabComponent {
  @Input() label = '';
}
