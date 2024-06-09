import { Injectable } from '@angular/core';
import { EnrollmentRestClient } from '@involvemint/client/shared/data-access';
import { StatusService } from '@involvemint/client/shared/util';
import { calculateEnrollmentStatus, EnrollmentsSpQuery, EnrollmentStatus } from '@involvemint/shared/domain';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch, pessimisticUpdate } from '@nrwl/angular';
import { from, of } from 'rxjs';
import { delayWhen, filter, map, switchMap, tap } from 'rxjs/operators';
import * as EnrollmentsSpActions from './enrollments.actions';

@Injectable()
export class EnrollmentsSpEffects {
  readonly loadEnrollments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnrollmentsSpActions.loadEnrollments),
      fetch({
        run: ({ projectId }) =>
          this.enrollment
            .getBySpProject(EnrollmentsSpQuery, { projectId })
            .pipe(
              map((enrollments) =>
                EnrollmentsSpActions.loadEnrollmentsSuccess({ enrollments, dto: { projectId } })
              )
            ),
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return EnrollmentsSpActions.loadEnrollmentsError({ error });
        },
      })
    )
  );

  readonly processEnrollmentApplication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnrollmentsSpActions.processEnrollmentApplication),
      pessimisticUpdate({
        run: ({ enrollment, approve }) =>
          this.enrollment.getBySpProject(EnrollmentsSpQuery, { projectId: enrollment.project.id }).pipe(
            switchMap((allEnrollments) => {
              if (
                allEnrollments.filter((e) => calculateEnrollmentStatus(e) === EnrollmentStatus.enrolled)
                  .length >= enrollment.project.maxChangeMakers
              ) {
                this.status.presentAlert({
                  title: `Unable to process enrollment application`,
                  description: `Project has reached the maximum amount of approved ChangeMakers, please retire 
                  someone or increase the "Maximum ChangeMaker Enrollments" on the project settings page`,
                });
                return of(false);
              } else {
                return from(
                  this.status.presentAlertWithAction({
                    alertData: {
                      title: `${approve ? 'Approve' : 'Deny'} Enrollment Application to Project ${
                        enrollment.project.title
                      }`,
                      description: `Are you sure you want to <b>${
                        approve ? 'Approve' : 'Deny'
                      }</b> ChangeMaker <b>@${
                        enrollment.changeMaker.handle.id
                      }</b>'s Enrollment Application to Project <b>${enrollment.project.title}</b>? ${
                        approve
                          ? `<b>@${enrollment.changeMaker.handle.id}</b> will then be able to upload
                        Proofs of Impact for this Project.`
                          : ''
                      }`,
                    },
                    buttonText: approve ? 'APPROVE' : 'DENY',
                    buttonCssClass: approve ? 'im-alert-confirm' : 'im-alert-deny',
                  })
                );
              }
            }),
            filter((result) => result),
            delayWhen(() =>
              from(this.status.showLoader(`${approve ? 'Approving' : 'Denying'} Enrollment Application...`))
            ),
            switchMap(() =>
              this.enrollment.processEnrollmentApplication(EnrollmentsSpQuery, {
                approve,
                enrollmentId: enrollment.id,
              })
            ),
            map((enrollment) => EnrollmentsSpActions.processEnrollmentApplicationSuccess({ enrollment }))
          ),
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return EnrollmentsSpActions.processEnrollmentApplicationError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly revertBackToPending$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnrollmentsSpActions.revertBackToPending),
      pessimisticUpdate({
        run: ({ enrollment }) =>
          from(
            this.status.presentAlertWithAction({
              alertData: {
                title: `Revert Enrollment Back To Pending Application`,
                description: `Are you sure you want to <b>revert</b> ChangeMaker 
                <b>@${enrollment.changeMaker.handle.id}</b>'s Enrollment Back to Pending?
                ${
                  enrollment.dateApproved
                    ? `This mean the <b>@${enrollment.changeMaker.handle.id}</b> will no longer be able to
                    create Proofs of Impact for this Project.`
                    : ''
                }
                You can approve or deny <b>@${enrollment.changeMaker.handle.id}</b>'s Enrollment Application
                again at any time.`,
              },
              buttonText: 'REVERT',
              buttonCssClass: 'im-alert-deny',
            })
          ).pipe(
            filter((v) => v),
            delayWhen(() => from(this.status.showLoader(`Reverting Enrollment Application...`))),
            switchMap(() =>
              this.enrollment.revertEnrollmentApplication(EnrollmentsSpQuery, {
                enrollmentId: enrollment.id,
              })
            ),
            map((enrollment) => EnrollmentsSpActions.revertBackToPendingSuccess({ enrollment }))
          ),
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return EnrollmentsSpActions.revertBackToPendingError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly retireEnrollment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnrollmentsSpActions.retireEnrollment),
      pessimisticUpdate({
        run: ({ enrollment }) =>
          from(
            this.status.presentAlertWithAction({
              alertData: {
                title: `Confirm Retirement`,
                description: `Are you sure you want to <b>retire</b> ChangeMaker
                  <b>@${enrollment.changeMaker.handle.id}</b>'s from Project ${enrollment.project.title}?`,
              },
              buttonText: 'RETIRE',
              buttonCssClass: 'im-alert-deny',
            })
          ).pipe(
            filter((v) => v),
            delayWhen(() => from(this.status.showLoader(`Retiring...`))),
            switchMap(() =>
              this.enrollment.retireEnrollment(EnrollmentsSpQuery, {
                enrollmentId: enrollment.id,
              })
            ),
            map((enrollment) => EnrollmentsSpActions.retireEnrollmentSuccess({ enrollment }))
          ),
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return EnrollmentsSpActions.retireEnrollmentError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly enrollment: EnrollmentRestClient,
    private readonly status: StatusService
  ) {}
}
