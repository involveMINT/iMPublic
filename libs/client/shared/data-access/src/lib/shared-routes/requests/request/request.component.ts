import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouteService } from '@involvemint/client/shared/routes';
import { parseOneImageFile, StatefulComponent, StatusService } from '@involvemint/client/shared/util';
import {
  defaultRequestListingStatus,
  environment,
  ImConfig,
  RequestListingStatus,
} from '@involvemint/shared/domain';
import { tapOnce } from '@involvemint/shared/util';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { auditTime, filter, skip, switchMap, tap } from 'rxjs/operators';
import { RequestStoreModel } from '../../../+state/requests/requests.reducer';
import { ActiveProfile } from '../../../+state/session/user-session.reducer';
import { UserFacade } from '../../../+state/user.facade';
import { ImImagesViewerModalService } from '../../../modals';

interface State {
  activeProfile: ActiveProfile | null;
  request: RequestStoreModel | null;
  loaded: boolean;
  savingState: 'unchanged' | 'changed' | 'saving';
}

@Component({
  selector: 'im-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestComponent extends StatefulComponent<State> implements OnInit {
  readonly requestForm = new FormGroup({
    listingStatus: new FormControl<RequestListingStatus>(defaultRequestListingStatus, (e) =>
      Validators.required(e)
    ),
    name: new FormControl('', (e) => Validators.required(e)),
    description: new FormControl('', [
      (e) => Validators.required(e),
      Validators.maxLength(ImConfig.maxDescriptionLength),
    ]),
    priceStatus: new FormControl<boolean>(undefined),
    price: new FormControl(0, (e) => Validators.required(e)),
  });

  readonly listingOptions: RequestListingStatus[] = ['public', 'private', 'unlisted'];

  readonly maxImagesPerItem = new Array(ImConfig.maxImagesPerItem);

  deepLink = '';

  constructor(
    private readonly user: UserFacade,
    private readonly route: RouteService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly status: StatusService,
    private readonly imagesViewer: ImImagesViewerModalService
  ) {
    super({ activeProfile: null, request: null, loaded: false, savingState: 'unchanged' });
  }

  ngOnInit(): void {
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
        ? this.route.rawRoutes.path.ep.storefront.myRequests.ROOT
        : this.route.rawRoutes.path.market.myRequests.ROOT
    }/${id}`; //TODO fix deep links

    this.effect(() =>
      this.user.requests.selectors.getRequest(id).pipe(
        filter(({ request }) => !!request),
        tapOnce(({ request }) => {
          if (!request) {
            return;
          }
          this.requestForm.patchValue({ ...request, price: request.price / 100 });
        }),
        tap(({ request, loaded }) => this.updateState({ request, loaded, savingState: 'unchanged' })),
        switchMap(() => this.requestForm.valueChanges),
        auditTime(0),
        skip(1),
        tap(() => this.updateState({ savingState: 'changed' }))
      )
    );
  }

  back() {
    if (this.state.activeProfile?.type === 'ep') {
      return this.route.to.ep.storefront.ROOT({ queryParams: { activeTab: 'requests' }, animation: 'back' });
    } else {
      return this.route.to.market.myRequests.ROOT({ animation: 'back' });
    }
  }

  refresh() {
    this.user.requests.dispatchers.refresh();
  }

  listingStatusChanged(state: Event): void {
    this.requestForm.patchValue({ listingStatus: (state as CustomEvent).detail.value }, { emitEvent: true });
  }

  save(request: RequestStoreModel) {
    this.updateState({ savingState: 'saving' });
    this.user.requests.dispatchers.update({
      requestId: request.id,
      changes: { ...this.requestForm.value, price: this.requestForm.value.price * 100 },
    });
  }

  async viewImages(paths: string[], index: number): Promise<void> {
    await this.imagesViewer.open({ imagesFilePaths: paths, slideIndex: index });
  }

  delete(request: RequestStoreModel) {
    if (this.state.activeProfile?.type === 'ep') {
      this.user.requests.dispatchers.delete(request, true);
    } else {
      this.user.requests.dispatchers.delete(request);
    }
  }

  uploadImage(request: RequestStoreModel, event: Event) {
    let file: File | undefined;

    try {
      file = parseOneImageFile(event);
    } catch (error) {
      this.status.presentAlert({ title: 'Error', description: error.message });
    }

    if (!file) return;

    this.user.requests.dispatchers.uploadImages(request, [file]);
  }

  deleteImage(request: RequestStoreModel, imageIndex: number) {
    this.user.requests.dispatchers.deleteImage({ requestId: request.id, index: imageIndex });
  }

  makeCoverImage(request: RequestStoreModel, imageIndex: number) {
    const newCover = request.imagesFilePaths[imageIndex];
    this.user.requests.dispatchers.update({
      requestId: request.id,
      changes: {
        imagesFilePaths: [newCover, ...request.imagesFilePaths.filter((i) => i !== newCover)],
      },
    });
  }
}
