import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouteService } from '@involvemint/client/shared/routes';
import { parseOneImageFile, StatefulComponent, StatusService } from '@involvemint/client/shared/util';
import {
  defaultOfferListingStatus,
  environment,
  ImConfig,
  OfferListingStatus,
} from '@involvemint/shared/domain';
import { tapOnce } from '@involvemint/shared/util';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { auditTime, filter, skip, switchMap, tap } from 'rxjs/operators';
import { OfferStoreModel } from '../../../+state/offers/offers.reducer';
import { ActiveProfile } from '../../../+state/session/user-session.reducer';
import { UserFacade } from '../../../+state/user.facade';
import { ImImagesViewerModalService } from '../../../modals';

interface State {
  activeProfile: ActiveProfile | null;
  offer: OfferStoreModel | null;
  loaded: boolean;
  savingState: 'unchanged' | 'changed' | 'saving';
}

@Component({
  selector: 'im-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferComponent extends StatefulComponent<State> implements OnInit {
  readonly offerForm = new FormGroup({
    listingStatus: new FormControl<OfferListingStatus>(defaultOfferListingStatus, (e) =>
      Validators.required(e)
    ),
    name: new FormControl('', (e) => Validators.required(e)),
    description: new FormControl('', [
      (e) => Validators.required(e),
      Validators.maxLength(ImConfig.maxDescriptionLength),
    ]),
    price: new FormControl(0, (e) => Validators.required(e)),
  });

  readonly listingOptions: OfferListingStatus[] = ['public', 'private', 'unlisted'];

  readonly maxImagesPerItem = new Array(ImConfig.maxImagesPerItem);

  deepLink = '';

  constructor(
    private readonly user: UserFacade,
    private readonly route: RouteService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly status: StatusService,
    private readonly imagesViewer: ImImagesViewerModalService
  ) {
    super({ activeProfile: null, offer: null, loaded: false, savingState: 'unchanged' });
  }

  ngOnInit() {
    this.effect(() =>
      this.user.session.selectors.activeProfile$.pipe(
        tap((activeProfile) => this.updateState({ activeProfile }))
      )
    );

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) {
      this.back();
      return;
    }

    this.deepLink = `${environment.appUrl}${
      this.state.activeProfile?.type === 'ep'
        ? this.route.rawRoutes.path.ep.storefront.myOffers.ROOT
        : this.route.rawRoutes.path.market.myOffers.ROOT
    }/${id}`; //TODO fix deep links

    this.effect(() =>
      this.user.offers.selectors.getOffer(id).pipe(
        filter(({ offer }) => !!offer),
        tapOnce(({ offer }) => {
          if (!offer) {
            return;
          }
          this.offerForm.patchValue({ ...offer, price: offer.price / 100 });
        }),
        tap(({ offer, loaded }) => this.updateState({ offer, loaded, savingState: 'unchanged' })),
        switchMap(() => this.offerForm.valueChanges),
        auditTime(0),
        skip(1),
        tap(() => this.updateState({ savingState: 'changed' }))
      )
    );
  }

  back() {
    if (this.state.activeProfile?.type === 'ep') {
      return this.route.to.ep.storefront.ROOT({ queryParams: { activeTab: 'offers' }, animation: 'back' });
    } else {
      return this.route.to.market.myOffers.ROOT({ animation: 'back' });
    }
  }

  refresh() {
    this.user.offers.dispatchers.refresh();
  }

  listingStatusChanged(state: Event): void {
    this.offerForm.patchValue({ listingStatus: (state as CustomEvent).detail.value }, { emitEvent: true });
  }

  save(offer: OfferStoreModel) {
    this.updateState({ savingState: 'saving' });
    this.user.offers.dispatchers.update({
      offerId: offer.id,
      changes: { ...this.offerForm.value, price: Number((this.offerForm.value.price * 100).toFixed(2)) },
    });
  }

  async viewImages(paths: string[], index: number): Promise<void> {
    await this.imagesViewer.open({ imagesFilePaths: paths, slideIndex: index });
  }

  delete(offer: OfferStoreModel) {
    if (this.state.activeProfile?.type === 'ep') {
      this.user.offers.dispatchers.delete(offer, true);
    } else {
      this.user.offers.dispatchers.delete(offer);
    }
  }

  uploadImage(offer: OfferStoreModel, event: Event) {
    let file: File | undefined;

    try {
      file = parseOneImageFile(event);
    } catch (error) {
      this.status.presentAlert({ title: 'Error', description: error.message });
    }

    if (!file) return;

    this.user.offers.dispatchers.uploadImages(offer, [file]);
  }

  deleteImage(offer: OfferStoreModel, imageIndex: number) {
    this.user.offers.dispatchers.deleteImage({ offerId: offer.id, index: imageIndex });
  }

  makeCoverImage(offer: OfferStoreModel, imageIndex: number) {
    const newCover = offer.imagesFilePaths[imageIndex];
    this.user.offers.dispatchers.update({
      offerId: offer.id,
      changes: {
        imagesFilePaths: [newCover, ...offer.imagesFilePaths.filter((i) => i !== newCover)],
      },
    });
  }
}
