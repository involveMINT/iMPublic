import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RouteService } from '@involvemint/client/shared/routes';
import { coordinateDistance, getPosition, StatefulComponent } from '@involvemint/client/shared/util';
import {
  calculatePoiStatus,
  calculatePoiTimeWorked,
  calculateProjectsHeld,
  formatImPublicAddress,
  Handle,
  Offer,
  PoiStatus,
  ProjectListingStatus,
  Request,
  ViewProfileInfoOfferQuery,
  ViewProfileInfoQuery,
  ViewProfileInfoRequestQuery,
  IParser
} from '@involvemint/shared/domain';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { UserFacade } from '../../+state/user.facade';
import { ChatService } from '../../chat.service';
import { ImImagesViewerModalService } from '../im-images-viewer-modal/im-images-viewer-modal.module';
import { ImProfileSelectModalService } from '../im-profile-select-modal/im-profile-select-modal.service';
import { HandleRestClient } from '../../rest-clients';

export const viewProfileCache = new Map<string, ProfileStoreModal>();

export type ProfileStoreModal = IParser<Handle, typeof ViewProfileInfoQuery>;
export type ProfileOfferModal = IParser<Offer[], typeof ViewProfileInfoOfferQuery>;
export type ProfileRequestModal = IParser<Request[], typeof ViewProfileInfoRequestQuery>;

export interface ImViewProfileModalInputs {
  handle: string;
}

interface State {
  profile: ProfileStoreModal | null;
  address: string | null;
  distance?: number;
}

@Component({
  selector: 'im-view-profile-modal',
  templateUrl: './im-view-profile-modal.component.html',
  styleUrls: ['./im-view-profile-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImViewProfileModalComponent
  extends StatefulComponent<State>
  implements OnInit, ImViewProfileModalInputs
{
  @Input() handle!: string;

  get PoiStatus() {
    return PoiStatus;
  }

  constructor(
    private readonly user: UserFacade,
    private readonly modal: ModalController,
    private readonly handleRestClient: HandleRestClient,
    private readonly profileSelect: ImProfileSelectModalService,
    private readonly chat: ChatService,
    private readonly image: ImImagesViewerModalService,
    private readonly route: RouteService
  ) {
    super({ profile: null, address: null });
  }

  ngOnInit(): void {
    this.effect(() =>
      of(viewProfileCache.get(this.handle)).pipe(
        switchMap((profile) => {
          if (profile) {
            return of(profile);
          } else {
            return this.handleRestClient.viewProfile(ViewProfileInfoQuery, { handle: this.handle });
          }
        }),
        tap((profile) => {
          viewProfileCache.set(this.handle, profile);
          this.updateState({ profile });
          if (profile.exchangePartner || profile.servePartner) {
            getPosition().then(({ lat, lng }) => {
              this.updateState({
                distance: this.distance(lat, lng, profile.exchangePartner || profile.servePartner),
              });
            });
          }
          const address =
            profile.changeMaker?.address || profile.exchangePartner?.address || profile.servePartner?.address;
          this.updateState({
            address: address ? formatImPublicAddress(address) : null,
          });
        })
      )
    );
  }

  private distance(
    lat: number,
    lng: number,
    profile: ProfileStoreModal['exchangePartner'] | ProfileStoreModal['servePartner']
  ) {
    if (profile && profile.latitude && profile.longitude) {
      return coordinateDistance(profile.latitude, profile.longitude, lat, lng);
    }
    return undefined;
  }

  async messageSeller(profile: ProfileStoreModal) {
    const handleId = profile.id;
    const messagingProfile = await this.profileSelect.open({
      title: 'Message User',
      header: `Which profile do you want to message @${handleId}?`,
    });
    if (messagingProfile && handleId) {
      this.user.session.dispatchers.setActiveProfile(messagingProfile.id);
      this.chat.upsert([{ handleId }]).then((result) => (result ? this.close() : null));
    }
  }

  getPublic(offersRequests: ProfileOfferModal | ProfileRequestModal) {
    const publicListingStatus: ProjectListingStatus = 'public';
    return offersRequests.filter((offerRequest) => offerRequest.listingStatus === publicListingStatus);
  }

  close() {
    this.modal.dismiss();
  }

  viewImage(url: string) {
    this.image.open({ imagesFilePaths: [url] });
  }

  refresh() {
    this.updateState({ profile: null });
    viewProfileCache.delete(this.handle);
    this.ngOnInit();
  }

  viewEnrollment(enrollment: string) {
    this.route.to.cm.enrollments.ENROLLMENT(enrollment);
    this.close();
  }

  projectCoverPage(project: string) {
    this.route.to.projects.COVER(project);
    this.close();
  }

  projectsHeld(cm: NonNullable<ProfileStoreModal['changeMaker']>) {
    return calculateProjectsHeld(cm.enrollments);
  }

  mapPois(cm: NonNullable<ProfileStoreModal['changeMaker']>) {
    return cm.enrollments
      .map((e) =>
        e.pois.map((poi) => ({
          ...poi,
          enrollment: e,
          status: calculatePoiStatus(poi),
          timeWorked: calculatePoiTimeWorked(poi),
        }))
      )
      .flat();
  }

  viewStorefront(ep: string) {
    this.route.to.market.ep.COVER(ep);
    this.close();
  }
}
