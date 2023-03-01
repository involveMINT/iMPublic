import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  ChangeMakerFacade,
  EnrollmentsModalService,
  PoiCmStoreModel,
} from '@involvemint/client/cm/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { calculatePoiStatus, calculatePoiTimeWorked, PoiStatus } from '@involvemint/shared/domain';
import { parseDate } from '@involvemint/shared/util';
import { compareDesc } from 'date-fns';
import { merge } from 'rxjs';
import { take, tap } from 'rxjs/operators';

interface State {
  pois: Array<PoiCmStoreModel & { status: PoiStatus; timeWorked: string; }>;
  loaded: boolean;
}

@Component({
  selector: 'involvemint-activityposts',
  templateUrl: './activityposts.component.html',
  styleUrls: ['./activityposts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoisComponent extends StatefulComponent<State> implements OnInit {
  get PoiStatus() {
    return PoiStatus;
  }

  constructor(
    private readonly cf: ChangeMakerFacade,
    private readonly route: RouteService,
    private readonly enrollmentsModal: EnrollmentsModalService
  ) {
    super({ pois: [], loaded: false });
  }

  ngOnInit(): void {
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
            loaded,
          })
        )
      )
    );
  }

  refresh() {
    this.cf.poi.dispatchers.refresh();
  }

  // viewEnrollment(enrollment: PoiCmStoreModel['enrollment']) {
  //   this.route.to.cf.enrollments.ENROLLMENT(enrollment.id);
  // }

  calculatePoiStatus(poi: PoiCmStoreModel) {
    return calculatePoiStatus(poi);
  }

  loadMore(event: Event) {
    this.cf.poi.dispatchers.loadMore();
    merge(this.cf.poi.actionListeners.loadPois.success, this.cf.poi.actionListeners.loadPois.error)
      .pipe(take(1))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe(() => (event.target as any).complete());
  }
}
