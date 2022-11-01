import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ChangeMakerFacade, EnrollmentStoreModel } from '@involvemint/client/cm/data-access';
import { UserFacade } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { ImTabsComponent } from '@involvemint/client/shared/ui';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { calculateEnrollmentStatus, EnrollmentStatus } from '@involvemint/shared/domain';
import { parseDate } from '@involvemint/shared/util';
import { compareDesc } from 'date-fns';
import { tap } from 'rxjs/operators';

interface State {
  enrollments: EnrollmentStoreModel[];
  loaded: boolean;
  index: number;
}

@Component({
  selector: 'involvemint-enrollments',
  templateUrl: './enrollments.component.html',
  styleUrls: ['./enrollments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnrollmentsComponent extends StatefulComponent<State> implements OnInit {
  @ViewChild('tabs') tabs!: ImTabsComponent;

  get EnrollmentStatus() {
    return EnrollmentStatus;
  }

  readonly WIDTH = 520;
  readonly HEIGHT = 100;
  readonly OFFSET = 20;
  readonly TOTAL_LENGTH = this.WIDTH - this.OFFSET * 2;

  constructor(
    private readonly cm: ChangeMakerFacade,
    private readonly user: UserFacade,
    private readonly route: RouteService
  ) {
    super({ enrollments: [], loaded: false, index: 0 });
  }

  ngOnInit(): void {
    this.effect(() =>
      this.cm.enrollments.selectors.enrollments$.pipe(
        tap(({ enrollments, loaded }) =>
          this.updateState({
            enrollments: enrollments.sort((a, b) =>
              compareDesc(parseDate(a.dateApplied), parseDate(b.dateApplied))
            ),
            loaded,
          })
        )
      )
    );
  }

  refresh() {
    this.cm.enrollments.dispatchers.refresh();
    this.user.projects.dispatchers.refresh();
  }

  projects() {
    this.tabs.setIndex(0);
  }

  settings() {
    this.route.to.settings.ROOT();
  }

  viewEnrollment(enrollment: EnrollmentStoreModel) {
    this.route.to.cm.enrollments.ENROLLMENT(enrollment.id, { animation: 'forward' });
  }

  withdraw(enrollment: EnrollmentStoreModel) {
    this.cm.enrollments.dispatchers.withdrawEnrollment(enrollment);
  }

  getEnrollmentStatus(enrollment: EnrollmentStoreModel) {
    return calculateEnrollmentStatus(enrollment);
  }

  // If we don't want the im-block animation then just use this trackBy! :D
  trackByEnrollmentId(_: number, enrollment: EnrollmentStoreModel): string {
    return enrollment.id;
  }

  newArr(length: number) {
    return [...Array(length).keys()];
  }
}
