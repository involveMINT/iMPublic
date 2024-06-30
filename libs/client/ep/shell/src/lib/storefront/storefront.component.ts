import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


import {
  ImImagesViewerModalService,
  UserFacade,
  UserStoreModel,
} from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { ImTabsComponent } from '@involvemint/client/shared/ui';
import { parseMultipleFiles, StatefulComponent, StatusService } from '@involvemint/client/shared/util';
import {
  defaultProjectListingStatus,
  environment,
  ImConfig,
  StorefrontListingStatus,
} from '@involvemint/shared/domain';
import { tapOnce, UnArray } from '@involvemint/shared/util';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { filter, skip, switchMap, tap } from 'rxjs/operators';

type Profile = NonNullable<UnArray<UserStoreModel['exchangeAdmins']>['exchangePartner']>;

interface State {
  activeTabIndex: number;
  profile: Profile | null;
  deepLink: string | null;
  savingState: 'saved' | 'unsaved' | 'saving';
}

@Component({
  selector: 'involvemint-storefront',
  templateUrl: './storefront.component.html',
  styleUrls: ['./storefront.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorefrontComponent extends StatefulComponent<State> implements OnInit {
  @ViewChild('tabs') tabs!: ImTabsComponent;

  readonly storeFrontForm = new FormGroup({
    listStoreFront: new FormControl<StorefrontListingStatus>(defaultProjectListingStatus, (e) =>
      Validators.required(e)
    ),
    description: new FormControl('', [Validators.maxLength(ImConfig.maxDescriptionLength)]),
  });

  readonly listingOptions: StorefrontListingStatus[] = ['public', 'private', 'unlisted'];

  readonly maxImagesPerItem = new Array(ImConfig.maxImagesPerItem);

  constructor(
    private readonly user: UserFacade,
    private readonly status: StatusService,
    private readonly imagesViewer: ImImagesViewerModalService,
    private readonly route: RouteService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    super({ activeTabIndex: 0, profile: null, deepLink: null, savingState: 'saved' });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe().subscribe(async ({ activeTab }) => {//subscribes to the query params angular router observable, returning activetab
      if (!activeTab) {
        return;
      }
      // re-route to same route to remove queryParams (activeTab)
      this.route.to.ep.storefront.ROOT({
        queryParams: {
          activeTab: undefined,
        },
      });
      this.updateState({//merges old state with new fields to create a new state
        activeTabIndex:
          activeTab === 'storefront' ? 0 : activeTab === 'offers' ? 1 : activeTab === 'requests' ? 2 : 0,
      });
      activeTab === 'storefront'
        ? this.tabs.setIndex(0)
        : activeTab === 'offers'
          ? this.tabs.setIndex(1)
          : activeTab === 'requests'
            ? this.tabs.setIndex(2)
            : this.tabs.setIndex(0);
    });

    this.effect(() =>//creates an observable that is subscribed to for the lifetime of the component
      this.user.session.selectors.activeProfileEp$.pipe(
        filter((exchangePartner) => !!exchangePartner),
        tapOnce((exchangePartner) => {
          if (!exchangePartner) {
            return;
          }
          this.storeFrontForm.patchValue({
            listStoreFront: exchangePartner.listStoreFront,
            description: exchangePartner.description,
          });
        }),
        tap((exchangePartner) => {
          this.storeFrontForm.markAsPristine();
          this.updateState({
            profile: exchangePartner,
            deepLink: `${environment.appUrl}${this.route.rawRoutes.path.market.ep.ROOT}/${exchangePartner.id}`,
            savingState: 'saved',
          });
        }),
        switchMap(() => this.storeFrontForm.valueChanges),
        skip(1),
        tap((form) => {
          this.updateState({ savingState: 'saving' });
          this.user.epProfile.dispatchers.editEpProfile({
            listStoreFront: form.listStoreFront,
            description: form.description,
          });
        }),

        tap((form) => {

          if (form.listStoreFront === 'private' || form.listStoreFront === 'unlisted') {
            console.log(`Value of listStoreFront: ${form.listStoreFront}`);
            console.log(`Type of listStoreFront: ${typeof form.listStoreFront}`);

            this.user.offers.selectors.offers$.pipe(
              tap(({ offers }) => {
                offers.forEach(offer => {
                  this.user.offers.dispatchers.update({
                    offerId: offer.id,
                    changes: {
                      listingStatus: form.listStoreFront,
                      name: offer.name,
                      description: offer.description,
                      price: offer.price
                    },
                  });

                });
                throw '';
              })
            ).subscribe();


          }
        })
      )
    );
  }


  tabChangeEvent(event: number) {
    if (typeof event !== 'number') {
      return;
    }
    this.updateState({
      activeTabIndex: event,
    });
  }

  async viewImages(paths: string[], index: number): Promise<void> {
    await this.imagesViewer.open({ imagesFilePaths: paths, slideIndex: index });
  }

  uploadImages(event: Event) {
    let files: File[] | undefined;
    try {
      files = parseMultipleFiles(event);
    } catch (error) {
      this.status.presentAlert({ title: 'Error', description: error.message });
    }

    if (!files) return;

    this.user.epProfile.dispatchers.uploadEpImages(files);
  }

  deleteImage(imagesFilePathsIndex: number): void {
    this.user.epProfile.dispatchers.deleteEpImage(imagesFilePathsIndex);
  }

  makeCoverPhoto(
    ep: UnArray<UserStoreModel['exchangeAdmins']>['exchangePartner'],
    imagesFilePathsIndex: number
  ) {
    const removed = [...ep.imagesFilePaths];
    removed.splice(imagesFilePathsIndex, 1);
    this.user.epProfile.dispatchers.editEpProfile({
      imagesFilePaths: [ep.imagesFilePaths[imagesFilePathsIndex], ...removed],
    });
  }
}
