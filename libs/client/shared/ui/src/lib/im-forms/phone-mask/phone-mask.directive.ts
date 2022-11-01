import { Directive, HostListener, OnInit, Optional } from '@angular/core';
import { FormControlName, NgControl } from '@angular/forms';
import { RxJSBaseClass } from '@involvemint/client/shared/util';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[imPhoneMask]',
})
export class PhoneMaskDirective extends RxJSBaseClass implements OnInit {
  constructor(
    @Optional() public formControlName?: FormControlName,
    @Optional() public ngControl?: NgControl
  ) {
    super();
  }

  ngOnInit() {
    if (this.formControlName) {
      this.formControlName.valueChanges
        ?.pipe(takeUntil(this.destroy$))
        .subscribe((val) => this.onInputChange(val, false));
    } else if (this.ngControl) {
      this.ngControl.valueChanges
        ?.pipe(takeUntil(this.destroy$))
        .subscribe((val) => this.onInputChange(val, false));
    }
  }

  @HostListener('keydown.backspace', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keydownBackspace(event: any) {
    this.onInputChange(event.target.value, true);
  }

  onInputChange(event: string, backspace: boolean) {
    let newVal = event.replace(/\D/g, '');

    if (backspace && newVal.length <= 6) {
      newVal = newVal.substring(0, newVal.length - 1);
    }

    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length <= 3) {
      newVal = newVal.replace(/^(\d{0,3})/, '($1)');
    } else if (newVal.length <= 6) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
    } else if (newVal.length <= 10) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    } else {
      newVal = newVal.substring(0, 10);
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    }

    if (this.formControlName) {
      this.formControlName.control.setValue(newVal, { emitEvent: false });
    } else if (this.ngControl) {
      this.ngControl.control?.patchValue(newVal, { emitEvent: false });
    }
  }
}
