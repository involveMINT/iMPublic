import { Injectable } from '@angular/core';
import { EnrollmentRestClient, UserFacade } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { InfoModalService, StatusService } from '@involvemint/client/shared/util';
import { EnrollmentsQuery } from '@involvemint/shared/domain';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch, pessimisticUpdate } from '@nrwl/angular';
import { from, of } from 'rxjs';
import { delayWhen, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { ChangeMakerFacade } from '../change-maker.facade';
import * as PassportActions from '../passport/passport.actions';
import * as EnrollmentsActions from './enrollments.actions';

@Injectable()
export class EnrollmentEffects {
  readonly loadEnrollments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnrollmentsActions.loadEnrollments),
      fetch({
        run: () =>
          this.enrollments.get(EnrollmentsQuery).pipe(
            map((enrollments) => {
              return EnrollmentsActions.loadEnrollmentsSuccess({ enrollments });
            })
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return EnrollmentsActions.loadEnrollmentsError({ error });
        },
      })
    )
  );

  readonly startApplication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnrollmentsActions.startApplication),
      pessimisticUpdate({
        run: ({ project }) =>
          from(
            // TODO: A component and not a string??
            this.status.presentAlertWithAction({
              alertData: {
                title: `Start Application to ${project.title}`,
                description: `
              <div class="im-alert-center-text">
                <div>The following information will be shared with ${project.servePartner.name}
                     when you start the application for this project:</div>
                <div>&nbsp;</div>
                <div>First and Last name</div>
                <div>Email address</div>
                <div>Phone number</div>
                <div>@handle</div>
                <div>Certifications & clearances</div>
                <div>Proofs of Impact</div>
                <div>&nbsp;</div>
              </div>`,
              },
              buttonText: 'APPLY',
              buttonCssClass: 'im-alert-confirm',
            })
          ).pipe(
            filter((v) => v),
            delayWhen(() => from(this.status.showLoader())),
            switchMap(() => this.enrollments.startApplication(EnrollmentsQuery, { projectId: project.id })),
            map((enrollment) => {
              this.route.to.cm.enrollments.ENROLLMENT(enrollment.id);
              return EnrollmentsActions.startApplicationSuccess({ enrollment });
            })
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return EnrollmentsActions.startApplicationError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly withdrawEnrollment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnrollmentsActions.withdrawEnrollment),
      pessimisticUpdate({
        run: ({ enrollment: { id, project } }) =>
          from(
            this.status.presentAlertWithAction({
              alertData: {
                title: `Confirm Withdrawal from ${project.title}`,
                description: `This withdraws your Enrollment to <b>${project.title}</b>.`,
              },
              buttonText: 'WITHDRAW',
              buttonCssClass: 'im-alert-deny',
            })
          ).pipe(
            filter((v) => v),
            delayWhen(() => from(this.status.showLoader('Withdrawing...'))),
            switchMap(() => this.enrollments.withdraw({ deletedId: true }, { enrollmentId: id })),
            map((deletedId) => {
              this.route.to.cm.enrollments.ROOT({ animation: 'back' });
              return EnrollmentsActions.withdrawEnrollmentSuccess(deletedId);
            })
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return EnrollmentsActions.withdrawEnrollmentError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly linkPassportDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnrollmentsActions.linkPassportDocument),
      delayWhen(() => from(this.status.showLoader('Linking...'))),
      pessimisticUpdate({
        run: ({ dto }) =>
          this.enrollments.linkPassportDocument(EnrollmentsQuery, dto).pipe(
            switchMap((enrollment) => {
              return of(
                EnrollmentsActions.linkPassportDocumentSuccess({ enrollment }),
                PassportActions.loadPassport()
              );
            })
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return EnrollmentsActions.linkPassportDocumentError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly submitApplication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnrollmentsActions.submitApplication),
      delayWhen(() => from(this.status.showLoader())),
      pessimisticUpdate({
        run: ({ dto }) =>
          this.user.session.selectors.changeMaker$.pipe(
            take(1),
            switchMap((cm) =>
              this.enrollments.submitApplication(EnrollmentsQuery, dto).pipe(
                switchMap(async (enrollment) => {
                  // Advance onboarding state
                  if (cm?.onboardingState === 'project') {
                    this.infoModal.open({
                      title: 'Onboarding Complete',
                      description: `You're all set.`,
                      icon: { name: '/assets/icons/im-applied-check.svg', source: 'src' },
                      useBackground: false,
                      buttonText: 'View My Profile',
                    });
                    this.route.to.cm.profile.ROOT();
                    this.user.cmProfile.dispatchers.editCmProfile({ onboardingState: 'none' });
                  } else if (cm?.onboardingState === 'market') {
                    this.route.to.cm.profile.ROOT();
                    this.user.cmProfile.dispatchers.editCmProfile({ onboardingState: 'none' });
                  }
                  return EnrollmentsActions.submitApplicationSuccess({ enrollment });
                })
              )
            )
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return EnrollmentsActions.submitApplicationError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly acceptWaiver$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnrollmentsActions.acceptWaiver),
      delayWhen(() => from(this.status.showLoader('Accepting...'))),
      pessimisticUpdate({
        run: ({ enrollment }) =>
          this.enrollments.acceptWaiver(EnrollmentsQuery, { enrollmentId: enrollment.id }).pipe(
            map((enrollment) => {
              return EnrollmentsActions.acceptWaiverSuccess({ enrollment });
            })
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return EnrollmentsActions.acceptWaiverError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly enrollments: EnrollmentRestClient,
    private readonly user: UserFacade,
    private readonly cf: ChangeMakerFacade,
    private readonly status: StatusService,
    private readonly route: RouteService,
    private readonly infoModal: InfoModalService
  ) {}
}
