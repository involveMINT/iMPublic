import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { UserFacade, UserStoreModel } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import {
  InfoModalService,
  parseOneImageFile,
  StatefulComponent,
  StatusService,
} from '@involvemint/client/shared/util';
import { EpOnboardingState, ImConfig } from '@involvemint/shared/domain';
import { UnArray } from '@involvemint/shared/util';
import { IonSlides } from '@ionic/angular';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { take, tap } from 'rxjs/operators';

type Profile = NonNullable<UnArray<UserStoreModel['exchangeAdmins']>['exchangePartner']>;

interface State {
  profile: Profile | null;
}

@Component({
  selector: 'involvemint-ep-onboarding',
  templateUrl: './ep-onboarding.component.html',
  styleUrls: ['./ep-onboarding.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpOnboardingComponent extends StatefulComponent<State> implements OnInit, AfterViewInit {
  @ViewChildren('slides') slides!: QueryList<IonSlides>;

  @ViewChild('logoFileInp') logoFileInp!: ElementRef<HTMLInputElement>;

  readonly createProfileForm = new FormGroup({
    description: new FormControl('', [
      (c) => Validators.required(c),
      Validators.maxLength(ImConfig.maxDescriptionLength),
    ]),
    budget: new FormControl(0, (c) => Validators.required(c)),
  });

  constructor(
    private readonly user: UserFacade,
    private readonly status: StatusService,
    private readonly infoModal: InfoModalService,
    private readonly route: RouteService
  ) {
    super({ profile: null });
  }

  ngOnInit(): void {
    this.effect(() =>
      this.user.session.selectors.activeProfileEp$.pipe(
        tap((exchangePartner) => {
          if (!exchangePartner) {
            return;
          }
          this.createProfileForm.patchValue({
            description: exchangePartner.description,
            budget: exchangePartner.budget / 100,
          });
          this.updateState({ profile: exchangePartner });
        })
      )
    );

    this.effect(() =>
      this.user.epProfile.actionListeners.editEpProfile.success.pipe(
        take(1),
        tap(({ exchangePartner }) => {
          this.status.dismissLoader();
          if (exchangePartner.onboardingState === EpOnboardingState.none) {
            this.status.dismissLoader();
            this.infoModal.open({
              title: 'Onboarding Complete',
              description: `Your SpendPartner Profile is Complete.
                          Information you have entered for your Profile can be edited
                          at any time from the Settings page.`,
              icon: { name: '/assets/icons/im-applied-check.svg', source: 'src' },
              useBackground: false,
              buttonText: 'View My Dashboard',
            });
            this.route.to.ep.dashboard.ROOT();
          }
        })
      )
    );

    this.effect(() =>
      this.user.epProfile.actionListeners.editEpProfile.error.pipe(
        tap(() => {
          this.status.dismissLoader();
        })
      )
    );
  }

  ngAfterViewInit() {
    this.effect(() =>
      this.slides.changes.pipe(
        tap(() => {
          this.slides.first.lockSwipes(true);
        })
      )
    );
  }

  next() {
    this.slides.first.lockSwipes(false);
    this.slides.first.slideNext();
    this.slides.first.lockSwipes(true);
  }

  prev() {
    this.slides.first.lockSwipes(false);
    this.slides.first.slidePrev();
    this.slides.first.lockSwipes(true);
  }

  async save() {
    await this.status.showLoader('Saving...');
    this.user.epProfile.dispatchers.editEpProfile({
      description: this.createProfileForm.value.description,
      budget: Number((this.createProfileForm.value.budget * 100).toFixed(2)),
      onboardingState: EpOnboardingState.none,
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

  async deleteLogoFile() {
    await this.status.showLoader('Deleting...');
    this.user.epProfile.dispatchers.editEpProfile({ logoFilePath: '' });
  }
}
