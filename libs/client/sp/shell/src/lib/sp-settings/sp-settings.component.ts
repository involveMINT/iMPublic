import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { UserFacade, UserStoreModel } from '@involvemint/client/shared/data-access';
import { parseOneImageFile, StatefulComponent, StatusService } from '@involvemint/client/shared/util';
import { ImConfig, ServePartner, IParser } from '@involvemint/shared/domain';
import { STATES, UnArray } from '@involvemint/shared/util';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';

type Profile = NonNullable<UnArray<UserStoreModel['serveAdmins']>['servePartner']>;

interface State {
  profile: Profile | null;
  saving: null | 'name' | 'description' | 'website' | 'address' | 'phone';
}

@Component({
  selector: 'sp-settings',
  templateUrl: './sp-settings.component.html',
  styleUrls: ['./sp-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpSettingsComponent extends StatefulComponent<State> implements OnInit {
  @ViewChild('logoFileInp') logoFileInp!: ElementRef<HTMLInputElement>;
  spId = '';

  readonly USStates = STATES;

  readonly nameForm = new FormControl<string>('', (c) => Validators.required(c));

  readonly descriptionForm = new FormControl<string | undefined>(
    '',
    Validators.maxLength(ImConfig.maxDescriptionLength)
  );

  readonly websiteForm = new FormControl<string>('', [
    (c) => Validators.required(c),
    Validators.pattern(ImConfig.regex.url),
  ]);

  readonly addressForm = new FormGroup<
    IParser<ServePartner['address'], { address1: true; city: true; state: true; zip: true }>
  >({
    address1: new FormControl('', Validators.pattern(ImConfig.regex.address)),
    city: new FormControl('', Validators.pattern(ImConfig.regex.city)),
    state: new FormControl('', Validators.pattern(ImConfig.regex.state)),
    zip: new FormControl('', Validators.pattern(ImConfig.regex.zipCode)),
    // country: new FormControl('', Validators.pattern(ImConfig.regex.country)),
  });

  readonly phoneForm = new FormControl<string>('', [
    (c) => Validators.required(c),
    Validators.pattern(ImConfig.regex.phone),
  ]);

  readonly emailForm = new FormControl<string>('', [
    (c) => Validators.required(c),
    Validators.pattern(ImConfig.regex.email),
  ]);

  constructor(private readonly user: UserFacade, private readonly status: StatusService) {
    super({ profile: null, saving: null });
  }

  ngOnInit(): void {
    this.effect(() =>
      this.user.session.selectors.activeProfileSp$.pipe(
        tap((sp) => {
          if (!sp) {
            return;
          }
          this.updateState({ saving: null });
          this.nameForm.patchValue(sp.name);
          this.descriptionForm.patchValue(sp.description);
          this.websiteForm.patchValue(sp.website);
          this.spId = sp.address.id;
          this.addressForm.patchValue({
            address1: sp.address.address1,
            city: sp.address.city,
            state: sp.address.state,
            zip: sp.address.zip,
            // country: sp.address.country,
          });
          this.phoneForm.patchValue(sp.phone);
          this.emailForm.patchValue(sp.email);
          this.nameForm.markAsPristine();
          this.descriptionForm.markAsPristine();
          this.phoneForm.markAsPristine();
          this.updateState({ profile: sp });
        })
      )
    );

    this.effect(() =>
      merge(
        this.user.spProfile.actionListeners.editSpProfile.success,
        this.user.spProfile.actionListeners.editSpProfile.error
      ).pipe(tap(() => this.updateState({ saving: null })))
    );
  }

  changeLogoFileButtonClick() {
    this.logoFileInp.nativeElement.click();
  }

  changeLogoFile(event: Event) {
    let file: File | undefined;
    try {
      file = parseOneImageFile(event);
    } catch (error) {
      this.status.presentAlert({ title: 'Error', description: error.message });
    }

    if (!file) return;

    this.user.spProfile.dispatchers.changeSpLogoFile(file);
  }

  deleteLogoFile() {
    this.user.spProfile.dispatchers.editSpProfile({ logoFilePath: '' });
  }

  changeBusinessName() {
    this.updateState({ saving: 'name' });
    this.user.spProfile.dispatchers.editSpProfile({
      name: this.nameForm.value,
    });
  }

  changeDescription() {
    this.updateState({ saving: 'description' });
    this.user.spProfile.dispatchers.editSpProfile({ description: this.descriptionForm.value });
  }

  changePhone() {
    this.updateState({ saving: 'phone' });
    this.user.spProfile.dispatchers.editSpProfile({ phone: this.phoneForm.value });
  }

  changeWebsite() {
    this.updateState({ saving: 'website' });
    this.user.spProfile.dispatchers.editSpProfile({ website: this.websiteForm.value });
  }

  changeAddress(profile: Profile) {
    this.updateState({ saving: 'address' });
    this.user.spProfile.dispatchers.editSpProfile({
      address: {
        id: profile.address.id,
        address1: this.addressForm.value.address1,
        city: this.addressForm.value.city,
        state: this.addressForm.value.state,
        zip: this.addressForm.value.zip,
      },
    });
  }
}
