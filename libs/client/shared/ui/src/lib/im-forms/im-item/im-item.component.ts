import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Input,
} from '@angular/core';
import { AbstractControl, FormControlDirective, FormControlName } from '@angular/forms';
import { ImCheckboxComponent } from '../im-checkbox/im-checkbox.component';

@Component({
  selector: 'im-item',
  templateUrl: './im-item.component.html',
  styleUrls: ['./im-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImItemComponent implements AfterContentChecked {
  @Input() label = '';
  @Input() required = false;
  @Input() touched = false;
  @Input() generic = false;
  @Input() info: string | null = null;

  @ContentChild(FormControlName) formControlName!: FormControlName;
  @ContentChild(FormControlDirective) formControl!: FormControlDirective;
  @ContentChild(ImCheckboxComponent) checkBox!: ImCheckboxComponent;

  @Input() hasError = false;

  constructor(private readonly change: ChangeDetectorRef) {}

  ngAfterContentChecked() {
    if (this.generic) {
      return;
    }
    if (this.formControlName) {
      const validatorFn = this.formControlName.control.validator;
      if (validatorFn) {
        const validator = validatorFn({} as AbstractControl);
        if (validator) this.required = validator.required;
      }
      if (this.touched) {
        this.hasError = (this.formControlName.invalid && this.formControlName.touched) ?? false;
      } else {
        this.hasError = this.formControlName.invalid ?? false;
      }
    } else if (this.formControl) {
      const validatorFn = this.formControl.validator;
      if (validatorFn) {
        const validator = validatorFn({} as AbstractControl);
        if (validator) this.required = validator.required;
      }
      if (this.touched) {
        this.hasError = (this.formControl.invalid && this.formControl.touched) ?? false;
      } else {
        this.hasError = this.formControl.invalid ?? false;
      }
    }
    this.change.detectChanges();
  }

  clicked() {
    // If you click on the ion-item, make sure to check the checkbox if there is one.
    if (this.checkBox) {
      this.checkBox.toggle();
      this.checkBox.emit();
    }
  }
}
