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
import { FormBuilder} from '@angular/forms';

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
  availableTags: string[] = ['Essentials', 'Arts & Entertainment', 'Professional Services', 'Trades', 'Rentals', 'Farming/Land', 'Food & Food Services', 'Health & Wellness', 'Transportation', 'Home Services', 'Youth', 'Seniors', 'Education/Training', 'Retail', 'Media & Print', 'Free'];
  

  readonly storeFrontForm = new FormGroup({
    listStoreFront: new FormControl<StorefrontListingStatus>(defaultProjectListingStatus, (e) =>
      Validators.required(e)
    ),
    description: new FormControl('', [Validators.maxLength(ImConfig.maxDescriptionLength)]),
    tags: new FormControl<string[]>([]),
    spendingOptions: new FormControl('')
  });

  readonly listingOptions: StorefrontListingStatus[] = ['public', 'private', 'unlisted'];

  readonly maxImagesPerItem = new Array(ImConfig.maxImagesPerItem);

  constructor(
    private readonly user: UserFacade,
    private readonly status: StatusService,
    private readonly imagesViewer: ImImagesViewerModalService,
    private readonly route: RouteService,
    private readonly activatedRoute: ActivatedRoute,
  ) {
    super({ activeTabIndex: 0, profile: null, deepLink: null, savingState: 'saved' });
    
  }

  ngOnInit(): void {
    
    this.activatedRoute.queryParams.pipe().subscribe(async ({ activeTab }) => {
      if (!activeTab) {
        return;
      }
      // re-route to same route to remove queryParams (activeTab)
      this.route.to.ep.storefront.ROOT({
        queryParams: {
          activeTab: undefined,
        },
      });
      this.updateState({
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

    this.effect(() =>
      this.user.session.selectors.activeProfileEp$.pipe(
        filter((exchangePartner) => !!exchangePartner),
        tapOnce((exchangePartner) => {
          if (!exchangePartner) {
            return;
          }
          console.log(exchangePartner)
          this.storeFrontForm.patchValue({
            listStoreFront: exchangePartner.listStoreFront,
            description: exchangePartner.description,
            tags: exchangePartner.tags, 
            spendingOptions: exchangePartner.spendingOptions
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
          console.log(this.storeFrontForm.get('tags')?.value)
          console.log(this.storeFrontForm.get('description')?.value)
          console.log(form.tags) 
          console.log(form.description)
          this.updateState({ savingState: 'saving' });
          this.user.epProfile.dispatchers.editEpProfile({
            listStoreFront: form.listStoreFront,
            description: form.description,
            tags: form.tags, 
            spendingOptions: form.spendingOptions
          });
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
    } catch (error:any) {
      this.status.presentAlert({ title: 'Error', description: error.message });
    }

    if (!files) return;

    this.user.epProfile.dispatchers.uploadEpImages(files);
  }



  deleteImage(imagesFilePathsIndex: number): void {
    this.user.epProfile.dispatchers.deleteEpImage(imagesFilePathsIndex);
  }

  addTag(tag: string) {
    console.log("we are hereeeeee")
    const currentTags = this.storeFrontForm.get('tags')?.value || [];
    if (tag && !currentTags.includes(tag)) {
      this.storeFrontForm.get('tags')?.patchValue([...currentTags, tag]);
      console.log('Updated Tags:', this.storeFrontForm.get('tags')?.value);
    }
  }
  
  onTagSelected(event: any) {
    const selectedTag = event.detail.value;
    this.addTag(selectedTag);
  }
  
  removeTag(index: number): void {
    const currentTags = [...this.storeFrontForm.get('tags')?.value]; // Make a copy of the array
    currentTags.splice(index, 1);
    this.storeFrontForm.get('tags')?.patchValue([...currentTags]);
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
