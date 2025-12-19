import { StatefulComponent } from '@involvemint/client/shared/util';
import { ImConfig, VerifyUserEmailQuery } from '@involvemint/shared/domain';
import { FormGroup } from '@ngneat/reactive-forms';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { UserRestClient } from './rest-clients';

export function verifyUserEmailUniqueness<
  F extends FormGroup<{ email: string }>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends StatefulComponent<any>
>(form: F, userClient: UserRestClient, comp: S) {
  return form.valueChanges.pipe(
    map((f) => f.email),
    distinctUntilChanged(),
    filter(() => form.controls.email.valid),
    tap(() => comp['updateState']({ verifyingUserEmail: true })),
    debounceTime(ImConfig.formDebounceTime),
    switchMap((email) => userClient.verifyUserEmail(VerifyUserEmailQuery, { email })),
    tap(({ isUnique }) => {
      form.controls.email.setErrors(isUnique ? null : { notUnique: true });
      comp['updateState']({ verifyingUserEmail: false });
    })
  );
}
