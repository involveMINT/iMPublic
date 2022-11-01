import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

interface Icon {
  source: 'src' | 'ionicon';
  name: string;
}

export interface InfoModalComponentProps {
  title: string;
  description: string;
  icon: Icon;
  useBackground: boolean;
  buttonText?: string;
  backText?: string;
}

@Component({
  selector: 'im-util-modal-info',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoModalComponent implements InfoModalComponentProps {
  @Input() title = '';
  @Input() description = '';
  @Input() icon!: Icon;
  @Input() useBackground = true;
  @Input() buttonText = 'OK';
  @Input() backText = '';

  constructor(private modal: ModalController) {}

  async dismiss(res: boolean): Promise<void> {
    await this.modal.dismiss(res);
  }
}
