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
import { LocationPermissionModalService } from '../../location-permission-modal/location-permission-modal.service';

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
    private readonly locationPerms: LocationPermissionModalService
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
      if ('permissions' in navigator && permissionStatus.state != 'granted') this.locationPerms.open();
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
