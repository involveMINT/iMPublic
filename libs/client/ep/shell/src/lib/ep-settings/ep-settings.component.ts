import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { UserFacade, UserStoreModel } from '@involvemint/client/shared/data-access';
import { parseOneImageFile, StatefulComponent, StatusService } from '@involvemint/client/shared/util';
import { ExchangePartner, ImConfig, IParser } from '@involvemint/shared/domain';
import { STATES, UnArray } from '@involvemint/shared/util';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';

type Profile = NonNullable<UnArray<UserStoreModel['exchangeAdmins']>['exchangePartner']>;

interface State {
  profile: Profile | null;
  saving: boolean;
}

@Component({
  selector: 'involvemint-ep-settings',
  templateUrl: './ep-settings.component.html',
  styleUrls: ['./ep-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpSettingsComponent extends StatefulComponent<State> implements OnInit {
  @Input() inline = false;

  @ViewChild('logoFileInp') logoFileInp!: ElementRef<HTMLInputElement>;

  readonly form = new FormGroup<
    IParser<
      ExchangePartner,
      {
        name: true;
        description: true;
        website: true;
        address: {
          address1: true;
          city: true;
          state: true;
          zip: true;
        };
        phone: true;
        email: true;
        ein: true;
      }
    >
  >({
    name: new FormControl('', (c) => Validators.required(c)),
    website: new FormControl('', [Validators.pattern(ImConfig.regex.url)]),
    description: new FormControl('', Validators.maxLength(ImConfig.maxDescriptionLength)),
    address: new FormGroup({
      address1: new FormControl('', Validators.pattern(ImConfig.regex.address)),
      city: new FormControl('', Validators.pattern(ImConfig.regex.city)),
      state: new FormControl('', Validators.pattern(ImConfig.regex.state)),
      zip: new FormControl('', Validators.pattern(ImConfig.regex.zipCode)),
      // country: new FormControl('', Validators.pattern(ImConfig.regex.country)),
    }),
    phone: new FormControl('', [(c) => Validators.required(c), Validators.pattern(ImConfig.regex.phone)]),
    email: new FormControl('', [Validators.pattern(ImConfig.regex.email)]),
    ein: new FormControl('', [Validators.pattern(ImConfig.regex.ein)]),
  });

  readonly USStates = STATES;

  constructor(private readonly user: UserFacade, private readonly status: StatusService) {
    super({ profile: null, saving: false });
  }

  ngOnInit(): void {
    this.effect(() =>
      this.user.session.selectors.activeProfileEp$.pipe(
        tap((exchangePartner) => {
          if (!exchangePartner) {
            return;
          }
          this.form.patchValue(exchangePartner);
          this.form.markAsPristine();
          this.updateState({ profile: exchangePartner });
        })
      )
    );

    this.effect(() =>
      merge(
        this.user.epProfile.actionListeners.editEpProfile.success,
        this.user.epProfile.actionListeners.editEpProfile.error
      ).pipe(tap(() => this.updateState({ saving: false })))
    );
  }

  save(profile: Profile) {
    this.updateState({ saving: true });
    this.user.epProfile.dispatchers.editEpProfile({
      ...this.form.value,
      address: {
        id: profile.address.id,
        ...this.form.value.address,
      },
    });
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

    this.user.epProfile.dispatchers.changeEpLogoFile(file);
  }

  deleteLogoFile() {
    this.user.epProfile.dispatchers.editEpProfile({ logoFilePath: '' });
  }
}
