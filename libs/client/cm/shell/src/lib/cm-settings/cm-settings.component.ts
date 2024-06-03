import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { HandleRestClient, UserFacade, UserStoreModel } from '@involvemint/client/shared/data-access';
import { parseOneImageFile, StatefulComponent, StatusService } from '@involvemint/client/shared/util';
import { ChangeMaker, ImConfig, VerifyHandleQuery, IParser } from '@involvemint/shared/domain';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, skip, switchMap, tap } from 'rxjs/operators';

type Profile = NonNullable<UserStoreModel['changeMaker']>;

interface State {
  profile: Profile | null;
  saving: boolean;
  verifyingHandle: boolean;
}

@Component({
  selector: 'involvemint-cm-settings',
  templateUrl: './cm-settings.component.html',
  styleUrls: ['./cm-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CmSettingsComponent extends StatefulComponent<State> implements OnInit {
  @ViewChild('profilePicInp') profilePicInp!: ElementRef<HTMLInputElement>;

  readonly form = new FormGroup<
    IParser<
      ChangeMaker,
      {
        firstName: true;
        lastName: true;
        handle: { id: string };
        bio: true;
        phone: true;
        email: true;
        ein: true;
      }
    >
  >({
    firstName: new FormControl(
      '',
      Validators.compose([(c) => Validators.required(c), Validators.pattern(ImConfig.regex.firstName)])
    ),
    lastName: new FormControl(
      '',
      Validators.compose([(c) => Validators.required(c), Validators.pattern(ImConfig.regex.lastName)])
    ),
    handle: new FormGroup({
      id: new FormControl('', Validators.pattern(ImConfig.regex.handle)),
    }),
    bio: new FormControl('', Validators.pattern(ImConfig.regex.bio)),
    phone: new FormControl('', [(c) => Validators.required(c), Validators.pattern(ImConfig.regex.phone)]),
  });

  constructor(
    private readonly user: UserFacade,
    private readonly status: StatusService,
    private readonly handleRestClient: HandleRestClient
  ) {
    super({ profile: null, saving: false, verifyingHandle: false });
  }

  ngOnInit(): void {
    // TODO This should be in a reusable handle change form component.
    this.effect(() =>
      this.form.valueChanges.pipe(
        map((f) => f.handle),
        distinctUntilChanged(),
        skip(2),
        filter((handle) => {
          if (handle.id === this.state.profile?.handle.id) {
            this.form.controls.handle.setErrors(null);
            return false;
          }
          return this.form.controls.handle.valid;
        }),
        tap(() => this.updateState({ verifyingHandle: true })),
        debounceTime(ImConfig.formDebounceTime),
        switchMap((handle) => this.handleRestClient.verifyHandle(VerifyHandleQuery, { handle: handle.id })),
        tap(({ isUnique }) => {
          this.form.controls.handle.setErrors(isUnique ? null : { notUnique: true });
          this.updateState({ verifyingHandle: false });
        })
      )
    );

    this.effect(() =>
      this.user.session.selectors.changeMaker$.pipe(
        tap((changeMaker) => {
          if (!changeMaker) {
            return;
          }
          this.form.patchValue(changeMaker, { emitEvent: false });
          this.form.markAsPristine();
          this.updateState({ profile: changeMaker });
        })
      )
    );

    this.effect(() =>
      merge(
        this.user.cmProfile.actionListeners.editCmProfile.success,
        this.user.cmProfile.actionListeners.editCmProfile.error
      ).pipe(tap(() => this.updateState({ saving: false })))
    );
  }

  changeProfilePicButtonClick() {
    this.profilePicInp.nativeElement.click();
  }

  changeProfilePic(event: Event) {
    let file: File | undefined;
    try {
      file = parseOneImageFile(event);
    } catch (error) {
      this.status.presentAlert({ title: 'Error', description: error.message });
    }

    if (!file) return;

    this.user.cmProfile.dispatchers.changeCmProfilePic(file);
  }

  deleteProfilePic() {
    this.user.cmProfile.dispatchers.editCmProfile({ profilePicFilePath: '' });
  }

  save() {
    this.updateState({ saving: true });
    this.user.cmProfile.dispatchers.editCmProfile(this.form.value);
  }
}
