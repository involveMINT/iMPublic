import {
  EnrollmentDocumentRepository,
  EnrollmentRepository,
  ProjectRepository
} from '@involvemint/server/core/domain-services';
import {
  AcceptWaiverDto,
  calculateEnrollmentStatus,
  Enrollment,
  EnrollmentStatus,
  environment,
  FrontendRoutes,
  FRONTEND_ROUTES_TOKEN,
  GetEnrollmentsBySpProject,
  LinkPassportDocumentDto,
  ProcessEnrollmentApplicationDto,
  RetireEnrollmentDto,
  RevertEnrollmentApplicationDto,
  StartEnrollmentApplicationDto,
  SubmitEnrollmentApplicationDto,
  WithdrawEnrollmentApplicationDto,
  Query,
  parseQuery
} from '@involvemint/shared/domain';
import { HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as uuid from 'uuid';
import { AuthService } from '../auth/auth.service';
import { EmailService } from '../email/email.service';
import { ProjectService } from '../project/project.service';
import { DbTransactionCreator } from '../transaction-creator/transaction-creator.service';

@Injectable()
export class EnrollmentService {
  constructor(
    private readonly enrollmentRepo: EnrollmentRepository,
    private readonly auth: AuthService,
    private readonly projectsRepo: ProjectRepository,
    private readonly enrollmentDocRepo: EnrollmentDocumentRepository,
    private readonly dbTransact: DbTransactionCreator,
    private readonly email: EmailService,
    private readonly projectService: ProjectService,
    @Inject(FRONTEND_ROUTES_TOKEN) private readonly route: FrontendRoutes
  ) {}

  async get(query: Query<Enrollment[]>, token: string) {
    const user = await this.auth.validateUserToken(token ?? '', { id: true, changeMaker: { id: true } });

    if (!user?.changeMaker) {
      throw new HttpException(
        `No associated ChangeMaker Profile found with user "${user.id}".`,
        HttpStatus.NOT_FOUND
      );
    }

    return this.enrollmentRepo.query(query, { where: { changeMaker: { id: user.changeMaker.id } } });
  }

  async getBySpProject(query: Query<Enrollment[]>, token: string, dto: GetEnrollmentsBySpProject) {
    const project = await this.projectsRepo.findOneOrFail(dto.projectId, { servePartner: { id: true } });
    await this.projectService.permissions.userIsServeAdmin(token, project.servePartner.id);
    return this.enrollmentRepo.query(query, { where: { project: { id: dto.projectId } } });
  }

  async startApplication(query: Query<Enrollment>, token: string, dto: StartEnrollmentApplicationDto) {
    const user = await this.auth.validateUserToken(token ?? '', {
      id: true,
      changeMaker: { id: true, handle: { id: true } },
    });

    if (!user?.changeMaker) {
      throw new HttpException(
        `No associated ChangeMaker Profile found with user "${user.id}".`,
        HttpStatus.NOT_FOUND
      );
    }

    const project = await this.projectsRepo.findOneOrFail(dto.projectId, {
      id: true,
      title: true,
      enrollments: {
        dateApplied: true,
        dateSubmitted: true,
        dateApproved: true,
        dateDenied: true,
        dateRetired: true,
      },
      maxChangeMakers: true,
      projectDocuments: {},
      servePartner: { admins: { user: { id: true } }, name: true },
    });

    if (
      project.enrollments.filter((e) => calculateEnrollmentStatus(e) === EnrollmentStatus.enrolled).length >=
      project.maxChangeMakers
    ) {
      throw new InternalServerErrorException(
        `The maximum number of ChangeMakers allotted for this project has been reached.`
      );
    }

    const rtn = await this.enrollmentRepo.upsert(
      {
        id: uuid.v4(),
        enrollmentDocuments: [],
        changeMaker: user.changeMaker.id,
        project: project.id,
        dateApplied: new Date(),
        pois: [],
        acceptedWaiver: false,
      },
      query
    );

    await this.email.sendInfoEmail({
      message: `@${user.changeMaker.handle.id} has started an application to your Project ${project.title}.`,
      subject: `New Project Enrollment Application`,
      user: project.servePartner.name,
      email: project.servePartner.admins.map((a) => a.user.id),
    });

    return rtn;
  }

  async withdraw(query: Query<{ deletedId: string }>, token: string, dto: WithdrawEnrollmentApplicationDto) {
    const user = await this.auth.validateUserToken(token ?? '', { changeMaker: { id: true } });
    const enrollment = await this.enrollmentRepo.findOneOrFail(dto.enrollmentId, {
      changeMaker: { id: true, handle: { id: true } },
      enrollmentDocuments: { id: true },
      project: { servePartner: { admins: { user: { id: true } }, name: true }, title: true },
    });

    if (user?.changeMaker?.id !== enrollment.changeMaker.id) {
      throw new HttpException('You cannot withdraw an application you do not own.', HttpStatus.UNAUTHORIZED);
    }

    await this.dbTransact.run(async () => {
      await this.enrollmentDocRepo.deleteMany(enrollment.enrollmentDocuments.map((ed) => ed.id));
      await this.enrollmentRepo.delete(dto.enrollmentId);
    });

    await this.email.sendInfoEmail({
      message: `@${enrollment.changeMaker.handle.id} has withdrew from your Project ${enrollment.project.title}.`,
      subject: `Enrollment Application Withdrawal`,
      user: enrollment.project.servePartner.name,
      email: enrollment.project.servePartner.admins.map((a) => a.user.id),
    });

    return parseQuery(query, { deletedId: dto.enrollmentId });
  }

  async linkPassportDocument(query: Query<Enrollment>, token: string, dto: LinkPassportDocumentDto) {
    const user = await this.auth.validateUserToken(token ?? '', { changeMaker: { id: true } });
    const enrollment = await this.enrollmentRepo.findOneOrFail(dto.enrollmentId, {
      changeMaker: { id: true },
      enrollmentDocuments: { id: true, passportDocument: { id: true }, projectDocument: { id: true } },
    });

    if (user?.changeMaker?.id !== enrollment.changeMaker.id) {
      throw new HttpException(
        'You cannot link a passport document to an enrollment that is not yours.',
        HttpStatus.UNAUTHORIZED
      );
    }

    const alreadyExisting = enrollment.enrollmentDocuments.find(
      (ed) => ed.projectDocument.id === dto.projectDocumentId
    );

    if (alreadyExisting) {
      await this.enrollmentDocRepo.update(alreadyExisting.id, {
        passportDocument: dto.passportDocumentId,
        projectDocument: dto.projectDocumentId,
        enrollment: dto.enrollmentId,
      });
    } else {
      await this.enrollmentDocRepo.upsert({
        id: uuid.v4(),
        passportDocument: dto.passportDocumentId,
        projectDocument: dto.projectDocumentId,
        enrollment: dto.enrollmentId,
      });
    }

    return this.enrollmentRepo.findOneOrFail(dto.enrollmentId, query);
  }

  async submitApplication(query: Query<Enrollment>, token: string, dto: SubmitEnrollmentApplicationDto) {
    const user = await this.auth.validateUserToken(token ?? '', { changeMaker: { id: true } });
    const enrollment = await this.enrollmentRepo.findOneOrFail(dto.enrollmentId, {
      changeMaker: { id: true, handle: { id: true } },
      acceptedWaiver: true,
      dateSubmitted: true,
      project: {
        projectDocuments: {},
        servePartner: { name: true, admins: { user: { id: true } } },
        title: true,
        requireCustomWaiver: true,
      },
      enrollmentDocuments: {},
    });

    if (user?.changeMaker?.id !== enrollment.changeMaker.id) {
      throw new HttpException(
        'You cannot submit an enrollment application you do not own.',
        HttpStatus.UNAUTHORIZED
      );
    }
    if (!enrollment.acceptedWaiver) {
      throw new HttpException(
        `You must accept the Project waiver${
          enrollment.project.requireCustomWaiver ? 's' : ''
        } in order to submit your Enrollment Application.`,
        HttpStatus.BAD_REQUEST
      );
    }
    if (enrollment.dateSubmitted) {
      throw new HttpException(
        'You have already submitted your application to this project.',
        HttpStatus.BAD_REQUEST
      );
    }
    if (enrollment.project.projectDocuments.length !== enrollment.enrollmentDocuments.length) {
      throw new HttpException(
        'You have not linked all your passport documents to this project. Please finish the application to submit.',
        HttpStatus.BAD_REQUEST
      );
    }

    const rtn = await this.enrollmentRepo.update(dto.enrollmentId, { dateSubmitted: new Date() }, query);

    await this.email.sendInfoEmail({
      message: `@${enrollment.changeMaker.handle.id} has submitted an application to your Project ${enrollment.project.title}.`,
      subject: `A Project Enrollment Application as been Submitted`,
      user: enrollment.project.servePartner.name,
      email: enrollment.project.servePartner.admins.map((a) => a.user.id),
    });

    return rtn;
  }

  async acceptWaiver(query: Query<Enrollment>, token: string, dto: AcceptWaiverDto) {
    const user = await this.auth.validateUserToken(token ?? '', { changeMaker: { id: true } });
    const enrollment = await this.enrollmentRepo.findOneOrFail(dto.enrollmentId, {
      changeMaker: { id: true },
      enrollmentDocuments: { id: true, passportDocument: { id: true }, projectDocument: { id: true } },
    });

    if (user?.changeMaker?.id !== enrollment.changeMaker.id) {
      throw new HttpException(
        'You cannot accept the waiver to an enrollment that is not yours.',
        HttpStatus.UNAUTHORIZED
      );
    }

    return this.enrollmentRepo.update(dto.enrollmentId, { acceptedWaiver: true }, query);
  }

  async processEnrollmentApplication(
    query: Query<Enrollment>,
    token: string,
    dto: ProcessEnrollmentApplicationDto
  ) {
    const enrollment = await this.enrollmentRepo.findOneOrFail(dto.enrollmentId, {
      id: true,
      dateApplied: true,
      dateApproved: true,
      dateDenied: true,
      dateRetired: true,
      dateSubmitted: true,
      changeMaker: { id: true, user: { id: true }, firstName: true },
      project: {
        servePartner: { id: true, admins: { user: { id: true } }, name: true },
        title: true,
      },
    });

    const user = await this.projectService.permissions.userIsServeAdmin(
      token,
      enrollment.project.servePartner.id
    );

    const status = calculateEnrollmentStatus(enrollment);
    if (status !== EnrollmentStatus.pending) {
      throw new HttpException(
        `This enrollment must be in a pending state to be processed. Current state: "${status}".`,
        HttpStatus.BAD_REQUEST
      );
    }
    if (user.changeMaker?.id === enrollment.changeMaker.id) {
      throw new HttpException(
        `Unauthorized to ${dto.approve ? 'approve' : 'deny'} your own application.
        You must have another ServeAdmin ${dto.approve ? 'approve' : 'deny'} your application.`,
        HttpStatus.UNAUTHORIZED
      );
    }

    let message: string | undefined;
    if (dto.approve) {
      await this.enrollmentRepo.update(dto.enrollmentId, { dateApproved: new Date() });
      message = `Congratulations! You're application to Project ${enrollment.project.title} has been
      approved!
      <br/><br/>
      This means you can now start creating Proofs of Impact and earn CommunityCredits.
      To do this, go to the app and navigate to the Ongoing tab of your
      <a href="${environment.appUrl}${this.route.path.cm.profile.ROOT}">profile</a> and click
      "Earn CommunityCredits" on the Project ${enrollment.project.title}.
      A representative from info@involvemint.io will be in touch to schedule an orientation to the network,
      and an introduction to your ServePartner.`;
    } else {
      await this.enrollmentRepo.update(dto.enrollmentId, { dateDenied: new Date() });
      message = `You're application to Project ${enrollment.project.title} has been denied.
      <br/><br/>
      This means that an administrator of ${enrollment.project.servePartner.name} has denied your application
      to this project. We encourage you to reach out to ${enrollment.project.servePartner.name} for more
      feedback. We want to emphasize that you can sign up for opportunities on the
      <a href="${environment.appUrl}${this.route.path.projects.ROOT}">Serve (Projects) feed</a>,
      or participate in the <a href="${environment.appUrl}${this.route.path.market.ROOT}">Marketplace</a> by
      requesting services or listing your own
      <a href="${environment.appUrl}${this.route.path.market.myOffers.ROOT}">offers</a>.`;
    }

    await this.email.sendInfoEmail({
      message,
      subject: `Project ${enrollment.project.title} Application Update`,
      user: enrollment.changeMaker.firstName,
      email: enrollment.changeMaker.user.id,
    });

    return this.enrollmentRepo.findOneOrFail(enrollment.id, query);
  }

  async revertEnrollmentApplication(
    query: Query<Enrollment>,
    token: string,
    dto: RevertEnrollmentApplicationDto
  ) {
    const enrollment = await this.enrollmentRepo.findOneOrFail(dto.enrollmentId, {
      id: true,
      dateApproved: true,
      dateApplied: true,
      dateDenied: true,
      dateRetired: true,
      dateSubmitted: true,
      project: { servePartner: { id: true } },
    });

    await this.projectService.permissions.userIsServeAdmin(token, enrollment.project.servePartner.id);

    const status = calculateEnrollmentStatus(enrollment);
    if (status !== EnrollmentStatus.enrolled && status !== EnrollmentStatus.denied) {
      throw new HttpException(
        'Cannot revert ChangeMaker because their application has not yet been approved nor denied.',
        HttpStatus.BAD_REQUEST
      );
    }

    // `null` will remove field.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await this.enrollmentRepo.update(dto.enrollmentId, { dateApproved: null!, dateDenied: null! });

    return this.enrollmentRepo.findOneOrFail(enrollment.id, query);
  }

  async retireEnrollment(query: Query<Enrollment>, token: string, dto: RetireEnrollmentDto) {
    const enrollment = await this.enrollmentRepo.findOneOrFail(dto.enrollmentId, {
      id: true,
      dateApproved: true,
      dateApplied: true,
      dateDenied: true,
      dateRetired: true,
      dateSubmitted: true,
      changeMaker: { user: { id: true }, firstName: true },
      project: {
        servePartner: { id: true, admins: { user: { id: true } }, name: true },
        title: true,
      },
    });

    await this.projectService.permissions.userIsServeAdmin(token, enrollment.project.servePartner.id);

    const status = calculateEnrollmentStatus(enrollment);
    if (status !== EnrollmentStatus.enrolled) {
      throw new HttpException(
        'Cannot deny ChangeMaker because their application has not yet been approved.',
        HttpStatus.BAD_REQUEST
      );
    }

    await this.enrollmentRepo.update(dto.enrollmentId, { dateRetired: new Date() });

    await this.email.sendInfoEmail({
      message: `You're application to Project ${enrollment.project.title} has been retired! This means you
      can no longer create Proofs of Impact and earn CommunityCredits.`,
      subject: `Project ${enrollment.project.title} Application Update`,
      user: enrollment.changeMaker.firstName,
      email: enrollment.changeMaker.user.id,
    });

    return this.enrollmentRepo.findOneOrFail(enrollment.id, query);
  }
}
