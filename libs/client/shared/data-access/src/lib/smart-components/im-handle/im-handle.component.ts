import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ImViewProfileModalService } from '../../modals/im-view-profile-modal/im-view-profile-modal.service';

@Component({
  selector: 'im-handle',
  templateUrl: './im-handle.component.html',
  styleUrls: ['./im-handle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImHandleComponent {
  @Input() handle!: string;

  constructor(private readonly viewProfileModal: ImViewProfileModalService) {}

  viewProfile(event: MouseEvent) {
    event.stopPropagation();
    this.viewProfileModal.open({ handle: this.handle });
  }
}
