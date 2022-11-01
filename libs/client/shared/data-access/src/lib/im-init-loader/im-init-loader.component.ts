import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'im-init-loader',
  templateUrl: './im-init-loader.component.html',
  styleUrls: ['./im-init-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('loader', [
      transition(':enter', [style({ opacity: 0 }), animate('250ms ease-in-out', style({ opacity: 1 }))]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('250ms ease-in-out', style({ opacity: 0, transform: 'scale(1.1)' })),
      ]),
    ]),
  ],
})
export class ImInitLoaderComponent {
  @HostBinding('@loader') animation = true;
}
