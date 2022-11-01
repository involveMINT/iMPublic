import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

/**
 * There are two purposes of this component:
 *
 * 1. Nested in an `im-item` for form errors.
 * 2. As an independent banner. Make sure to set `userAsBanner` to true if this is your use case.
 */
@Component({
  selector: 'im-error',
  templateUrl: './im-error.component.html',
  styleUrls: ['./im-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImErrorComponent {
  /** Set to true when you want to use this component as an independent banner. */
  @Input() @HostBinding('class.bg') useAsBanner = false;
}
