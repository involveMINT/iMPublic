import { EnrollmentService } from '@involvemint/server/core/application-services';
import { InvolvemintRoutes, EnrollmentsQuery, EnrollmentsSpQuery, GetEnrollmentsBySpProject, StartEnrollmentApplicationDto, WithdrawEnrollmentApplicationDto, LinkPassportDocumentDto, SubmitEnrollmentApplicationDto, AcceptWaiverDto, ProcessEnrollmentApplicationDto, RevertEnrollmentApplicationDto, RetireEnrollmentDto } from '@involvemint/shared/domain';
import {
    Controller,
    Post,
    Body
  } from '@nestjs/common';

@Controller(InvolvemintRoutes.enrollment)
export class EnrollmentController {
    constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post('get')
  get(@Body() token: string) {
      return this.enrollmentService.get(EnrollmentsQuery, token);
  }

  @Post()
  getBySpProject(@Body() body : { token: string, dto: GetEnrollmentsBySpProject }) {
    return this.enrollmentService.getBySpProject(EnrollmentsSpQuery, body.token, body.dto);
  }

  @Post()
  startApplication(@Body() body : { token: string, dto: StartEnrollmentApplicationDto }) {
    return this.enrollmentService.startApplication(EnrollmentsQuery, body.token, body.dto);
  }

  @Post()
  withdraw(@Body() body : { token: string, dto: WithdrawEnrollmentApplicationDto }) {
    return this.enrollmentService.withdraw({ deletedId: true }, body.token, body.dto);
  }

  @Post()
  linkPassportDocument(@Body() body : { token: string, dto: LinkPassportDocumentDto }) {
    return this.enrollmentService.linkPassportDocument(EnrollmentsQuery, body.token, body.dto);
  }

  @Post()
  submitApplication(@Body() body : { token: string, dto: SubmitEnrollmentApplicationDto }) {
    return this.enrollmentService.submitApplication(EnrollmentsQuery, body.token, body.dto);
  }

  @Post()
  acceptWaiver(@Body() body : { token: string, dto: AcceptWaiverDto }) {
    return this.enrollmentService.acceptWaiver(EnrollmentsQuery, body.token, body.dto);
  }

  @Post()
  processEnrollmentApplication(@Body() body : { token: string, dto: ProcessEnrollmentApplicationDto }) {
    return this.enrollmentService.processEnrollmentApplication(EnrollmentsSpQuery, body.token, body.dto);
  }

  @Post()
  revertEnrollmentApplication(@Body() body : { token: string, dto: RevertEnrollmentApplicationDto }) {
    return this.enrollmentService.revertEnrollmentApplication(EnrollmentsSpQuery, body.token, body.dto);
  }

  @Post()
  retireEnrollment(@Body() body : { token: string, dto: RetireEnrollmentDto }) {
    return this.enrollmentService.retireEnrollment(EnrollmentsSpQuery, body.token, body.dto);
  }

}