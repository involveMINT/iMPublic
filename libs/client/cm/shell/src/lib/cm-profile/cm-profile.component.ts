import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChangeMakerFacade, EnrollmentStoreModel, PoiCmStoreModel } from '@involvemint/client/cm/data-access';
import { UserFacade, UserStoreModel } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { parseOneImageFile, StatefulComponent, StatusService } from '@involvemint/client/shared/util';
import {
  calculatePoiStatus,
  calculatePoiTimeWorked,
  calculateProjectsHeld,
  PoiStatus,
} from '@involvemint/shared/domain';
import { parseDate } from '@involvemint/shared/util';
import { compareDesc } from 'date-fns';
import { merge } from 'rxjs';
import { take, tap } from 'rxjs/operators';

type CmProfile = NonNullable<UserStoreModel['changeMaker']>;

interface State {
  profile: CmProfile | null;
  enrollments: EnrollmentStoreModel[];
  pois: Array<PoiCmStoreModel & { status: PoiStatus; timeWorked: string }>;
  poisLoaded: boolean;
  projectsHeld: number;
  saving: null | 'bio' | 'name' | 'phone';
  enrollmentsLoaded: boolean;
}

@Component({
  selector: 'involvemint-cm-profile',
  templateUrl: './cm-profile.component.html',
  styleUrls: ['./cm-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CmProfileComponent extends StatefulComponent<State> implements OnInit {
  @ViewChild('profilePicInp') profilePicInp!: ElementRef<HTMLInputElement>;

  get PoiStatus() {
    return PoiStatus;
  }

  constructor(
    private readonly user: UserFacade,
    private readonly cf: ChangeMakerFacade,
    private readonly status: StatusService,
    private readonly route: RouteService
  ) {
    super({
      profile: null,
      saving: null,
      enrollments: [],
      enrollmentsLoaded: false,
      projectsHeld: 0,
      pois: [],
      poisLoaded: false,
    });
  }

  ngOnInit(): void {
    this.effect(() =>
      this.user.session.selectors.changeMaker$.pipe(
        tap((changeMaker) => this.updateState({ profile: changeMaker }))
      )
    );

    this.effect(() =>
      this.cf.enrollments.selectors.enrollments$.pipe(
        tap(({ enrollments, loaded }) =>
          this.updateState({
            enrollments,
            enrollmentsLoaded: loaded,
            projectsHeld: calculateProjectsHeld(enrollments),
          })
        )
      )
    );
  }

  tabChangeEvent(activeTabIndex: number) {
    if (activeTabIndex === 2) {
      this.effect(() =>
        this.cf.poi.selectors.pois$.pipe(
          tap(({ pois, loaded }) =>
            this.updateState({
              pois: pois
                .sort((a, b) =>
                  compareDesc(parseDate(a.dateStarted ?? new Date()), parseDate(b.dateStarted ?? new Date()))
                )
                .map((poi) => ({
                  ...poi,
                  status: calculatePoiStatus(poi),
                  timeWorked: calculatePoiTimeWorked(poi),
                })),
              poisLoaded: loaded,
            })
          )
        )
      );
    }
  }

  changeProfilePicButtonClick() {
    this.profilePicInp.nativeElement.click();
  }

  settings() {
    this.route.to.cm.settings.ROOT();
  }

  changeProfilePic(event: Event) {
    let file: File | undefined;
    try {
      file = parseOneImageFile(event);
    } catch (error) {
      this.status.presentAlert({ title: 'Error', description: error.message });
    }

    if (!file) return;

    this.user.cmProfile.dispatchers.changeCmProfilePic(file);
  }

  projectCoverPage(project: EnrollmentStoreModel['project']) {
    this.route.to.projects.COVER(project.id);
  }

  createPoi(enrollment: EnrollmentStoreModel) {
    this.cf.poi.dispatchers.create(enrollment);
  }

  viewPoi(poi: PoiCmStoreModel) {
    this.route.to.cm.pois.POI(poi.id);
  }

  viewEnrollment(enrollment: EnrollmentStoreModel) {
    this.route.to.cm.enrollments.ENROLLMENT(enrollment.id);
  }

  loadMore(event: Event) {
    this.cf.poi.dispatchers.loadMore();
    merge(this.cf.poi.actionListeners.loadPois.success, this.cf.poi.actionListeners.loadPois.error)
      .pipe(take(1))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe(() => (event.target as any).complete());
  }
}
