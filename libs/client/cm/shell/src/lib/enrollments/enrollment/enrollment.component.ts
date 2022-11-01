import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ChangeMakerFacade,
  EnrollmentStoreModel,
  PassportModalService,
} from '@involvemint/client/cm/data-access';
import { UserFacade, UserStoreModel } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatefulComponent, StatusService } from '@involvemint/client/shared/util';
import { calculateEnrollmentStatus, EnrollmentStatus } from '@involvemint/shared/domain';
import { UnArray } from '@involvemint/shared/util';
import { tap } from 'rxjs/operators';
import { SignWaiverModalService } from '../sign-waiver-modal/sign-waiver-modal.service';

type CmProfile = NonNullable<UserStoreModel['changeMaker']>;
interface State {
  enrollment: EnrollmentStoreModel | null;
  loaded: boolean;
  status: EnrollmentStatus | null;
  profile: CmProfile | null;
}

@Component({
  selector: 'involvemint-cm-feature-projects-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnrollmentComponent extends StatefulComponent<State> implements OnInit {
  get EnrollmentStatus() {
    return EnrollmentStatus;
  }

  constructor(
    private readonly cf: ChangeMakerFacade,
    public readonly route: RouteService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly passportModal: PassportModalService,
    private readonly signWaiverModal: SignWaiverModalService,
    private readonly status: StatusService,
    private readonly user: UserFacade
  ) {
    super({ loaded: false, enrollment: null, status: null, profile: null });
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) {
      this.back();
      return;
    }

    this.effect(() =>
      this.user.session.selectors.changeMaker$.pipe(
        tap((changeMaker) => this.updateState({ profile: changeMaker }))
      )
    );

    this.effect(() =>
      this.cf.enrollments.selectors.getEnrollment(id).pipe(
        tap(({ enrollment, loaded }) => {
          if (!enrollment && loaded) {
            this.route.to.cm.enrollments.ROOT();
          }
          this.updateState({
            enrollment,
            loaded,
            status: enrollment ? calculateEnrollmentStatus(enrollment) : null,
          });

          if (
            this.state.enrollment &&
            !this.state.enrollment?.acceptedWaiver &&
            this.state.enrollment?.enrollmentDocuments.length ===
              this.state.enrollment?.project.projectDocuments.length
          ) {
            this.openWaiver(this.state.enrollment);
          }
        })
      )
    );
  }

  back() {
    return this.route.back(() => this.route.to.cm.enrollments.ROOT({ animation: 'back' }));
  }

  refresh() {
    this.cf.enrollments.dispatchers.refresh();
  }

  async openWaiver(enrollment: EnrollmentStoreModel) {
    const waiverAccepted = await this.signWaiverModal.open({ enrollment });
    if (!waiverAccepted) {
      return;
    }
    if (waiverAccepted) {
      const m = await this.status.presentAlertWithAction({
        alertData: {
          title: `${this.state.profile?.firstName}, are you sure you want to sign the waiver? `,
          description: '',
        },
        buttonText: 'YES',
        cancelButtonText: 'NO',
        buttonCssClass: 'im-alert-confirm',
      });
      if (!m) return;
    }

    this.cf.enrollments.dispatchers.acceptWaiver(enrollment);
  }

  async linkPassportDocument(enrollment: EnrollmentStoreModel, projectDocumentId: string) {
    const doc = await this.passportModal.open({
      title: 'Attach Passport Document',
      header: `Which Passport Document do you want to attach to your Enrollment <b>${enrollment.project.title}</b>?`,
    });
    if (!doc) {
      return;
    }

    this.cf.enrollments.dispatchers.linkPassportDocument({
      enrollmentId: enrollment.id,
      passportDocumentId: doc.id,
      projectDocumentId,
    });
  }

  findLinkedPassportDocument(enrollment: EnrollmentStoreModel, projectDocumentId: string) {
    return {
      linkedDoc: enrollment.enrollmentDocuments.find((ed) => ed.projectDocument.id === projectDocumentId),
    };
  }

  docUrl(link: string) {
    if (!link.includes('https://')) {
      return `https://${link}`;
    }
    return link;
  }

  submitApplication(enrollment: EnrollmentStoreModel) {
    this.cf.enrollments.dispatchers.submitApplication({ enrollmentId: enrollment.id });
  }

  withdrawEnrollment(enrollment: EnrollmentStoreModel) {
    this.cf.enrollments.dispatchers.withdrawEnrollment(enrollment);
  }

  viewPassportDocument(document: UnArray<EnrollmentStoreModel['enrollmentDocuments']>['passportDocument']) {
    this.route.to.cm.passport.DOCUMENT(document.id);
  }

  project(project: EnrollmentStoreModel['project']) {
    return this.route.to.projects.COVER(project.id);
  }

  /** Prevent directly clicking checkbox. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checkboxClicked(event: any) {
    event.target.checked = !event.target.checked;
  }

  poi(enrollment: EnrollmentStoreModel) {
    this.cf.poi.dispatchers.create(enrollment);
  }
}
