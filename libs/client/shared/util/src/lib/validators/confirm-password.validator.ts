import { AbstractControl } from '@angular/forms';
export class ConfirmPasswordValidator {
  static MatchPassword(
    control: AbstractControl,
    passwordFormName: string,
    confirmPasswordFormName: string
  ): { notSame: boolean } | undefined {
    const password = control.get(passwordFormName)?.value;
    const confirmPassword = control.get(confirmPasswordFormName)?.value;

    return password === confirmPassword ? undefined : { notSame: true };
  }
}
