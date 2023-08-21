import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import {
  ImViewProfileModalService,
  ProjectFeedStoreModel,
  UserFacade,
} from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { calculateEnrollmentStatus, EnrollmentStatus } from '@involvemint/shared/domain';
import { parseDate } from '@involvemint/shared/util';
import { formatDistanceToNow } from 'date-fns';
import { tap } from 'rxjs/operators';
import { StatusService } from '@involvemint/client/shared/util';

interface State {
  projects: ProjectFeedStoreModel[];
  loaded: boolean;
}

@Component({
  selector: 'involvemint-browse-projects-page',
  templateUrl: './browse-projects.component.html',
  styleUrls: ['./browse-projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseProjectsComponent extends StatefulComponent<State> implements OnInit {
  @Input() inline = false;

  constructor(
    private readonly user: UserFacade,
    private readonly route: RouteService,
    private readonly viewProfile: ImViewProfileModalService,
    private readonly status: StatusService,
  ) {
    super({ projects: [], loaded: false });
  }

  async ngOnInit() {
    this.effect(() =>
      this.user.projects.selectors.projects$.pipe(
        tap(({ projects, loaded }) =>
          this.updateState({
            // Filter by public so it won't show any unlisted projects that an SP may have viewed
            // then went back to the projects feed.
            projects: projects.filter((p) => p.listingStatus === 'public'),
            loaded,
          })
        )
      )
    );

    try { // only show permissions modal if supported and not granted
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
      if ('permissions' in navigator && permissionStatus.state != 'granted') {
        if ( permissionStatus.state == 'prompt') {
          this.status.presentAlertWithAction({
            alertData: { 
              title: 'Enable Location Services', 
              description: 'Please enable location services on your device to enjoy the full features of our app. Your privacy is important to us, and we assure you that we use location data responsibly to improve your app experience.'
            },
            buttonText: 'Enable',
            cancelButtonText: 'Remind me Later',
            buttonCssClass: 'im-alert-confirm',
          })
          .then((res) => { if (res) navigator.geolocation.getCurrentPosition(() => {}) });
        }
        
        else if ( permissionStatus.state == 'denied') {
          this.status.presentAlert({
            title: 'Disabled Location Services', 
            description: "You have prevented involveMINT from accessing location services on this device. Some of our features will not be fully functional. To enable location services, please go to your device settings and allow our app to access your location. If you need any assistance, feel free to reach out to our support team at <a>hello@involvemint.io</a>."
          });
        }
      }
    } catch (error) { console.error('Error checking location permission:', error); }
  }

  refresh() {
    this.user.projects.dispatchers.refresh();
  }

  gotoCoverPage(project: ProjectFeedStoreModel): void {
    this.route.to.projects.COVER(project.id, { animation: 'forward' });
  }

  refreshBrowse(event: Event): void {
    this.completeSpinner(event);
    // this.cf.projects.dispatchers.loadProjects(1, ImConfig.browseProjectsPaginateItemsLoad);
  }

  loadMoreProjects(event: Event) {
    this.completeSpinner(event);
    // this.page++;
    // this.cf.projects.dispatchers.loadProjects(this.page, ImConfig.browseProjectsPaginateItemsLoad);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private completeSpinner(event: Event) {
    // merge(
    //   this.cf.projects.actionListeners.loadProjects.success,
    //   this.cf.projects.actionListeners.loadProjects.error
    // )
    //   .pipe(take(1), takeUntil(this.destroy$))
    //   .subscribe(() => (event.target as HTMLIonRefresherElement | HTMLIonInfiniteScrollElement).complete());
  }

  viewSp(project: ProjectFeedStoreModel) {
    this.viewProfile.open({ handle: project.servePartner.handle.id });
  }

  formatDistanceToNow(date: Date | string) {
    return formatDistanceToNow(parseDate(date));
  }

  slotsRemaining(project: ProjectFeedStoreModel) {
    const len = project.enrollments.filter(
      (e) => calculateEnrollmentStatus(e) === EnrollmentStatus.enrolled
    ).length;
    return project.maxChangeMakers - len;
  }
}
