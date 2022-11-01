import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  SkipSelf,
} from '@angular/core';
import { ControlContainer, FormControl } from '@angular/forms';

export interface ImCheckBoxCheckEvent {
  checked: boolean;
  revert: () => void;
}

export const formControlFactory = (container: ControlContainer) => container;

@Component({
  selector: 'im-checkbox',
  templateUrl: './im-checkbox.component.html',
  styleUrls: ['./im-checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: formControlFactory,
      deps: [[new SkipSelf(), ControlContainer]],
    },
  ],
})
export class ImCheckboxComponent {
  @Input() controlName = '';
  @Input() checked = false;
  @Output() checkedChanged = new EventEmitter<ImCheckBoxCheckEvent>();

  control!: FormControl;

  constructor(private readonly change: ChangeDetectorRef) {}

  toggle() {
    this.checked = !this.checked;
    this.change.detectChanges();
  }

  emit() {
    this.checkedChanged.emit({ checked: this.checked, revert: () => this.toggle() });
  }
}
