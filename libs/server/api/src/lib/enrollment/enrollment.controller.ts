import { EnrollmentService } from '@involvemint/server/core/application-services';
import {
  AcceptWaiverDto,
  Enrollment,
  EnrollmentsQuery,
  EnrollmentsSpQuery,
  GetEnrollmentsBySpProject,
  StartEnrollmentApplicationDto,
  WithdrawEnrollmentApplicationDto,
  LinkPassportDocumentDto,
  SubmitEnrollmentApplicationDto,
  ProcessEnrollmentApplicationDto,
  RevertEnrollmentApplicationDto,
  RetireEnrollmentDto,
  InvolvemintRoutes,
  QUERY_KEY,
  Query,
  TOKEN_KEY,
  DTO_KEY,
  Project,
} from '@involvemint/shared/domain';
import {
    Controller,
    Post,
    Body,
    Headers
  } from '@nestjs/common';
import { QueryValidationPipe, ValidationPipe } from '../pipes';

@Controller(InvolvemintRoutes.enrollment)
export class EnrollmentController {
    constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post('get')
  get(
    @Body(QUERY_KEY, new QueryValidationPipe(EnrollmentsQuery)) query: Query<Enrollment[]>, 
    @Headers(TOKEN_KEY) token: string 
  ){
      return this.enrollmentService.get(query, token);
  }

  @Post('getBySpProject')
  getBySpProject(
    @Body(QUERY_KEY, new QueryValidationPipe(EnrollmentsSpQuery)) query: Query<Enrollment[]>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: GetEnrollmentsBySpProject
  ) {
    return this.enrollmentService.getBySpProject(query, token, dto);
  }

  @Post('startApplication')
  startApplication(
    @Body(QUERY_KEY, new QueryValidationPipe(EnrollmentsQuery)) query: Query<Enrollment>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: StartEnrollmentApplicationDto
  ) {
    return this.enrollmentService.startApplication(query, token, dto);
  }

  @Post('withdraw')
  withdraw(
    @Body(QUERY_KEY, new QueryValidationPipe({ deletedId: true })) query: Query<{ deletedId: string }>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: WithdrawEnrollmentApplicationDto
    ) {
    return this.enrollmentService.withdraw(query, token, dto);
  }

  @Post('linkPassportDocument')
  linkPassportDocument(
    @Body(QUERY_KEY, new QueryValidationPipe(EnrollmentsQuery)) query: Query<Enrollment>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: LinkPassportDocumentDto
  ) {
    return this.enrollmentService.linkPassportDocument(query, token, dto);
  }

  @Post('submitApplication')
  submitApplication(
    @Body(QUERY_KEY, new QueryValidationPipe(EnrollmentsQuery)) query: Query<Enrollment>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: SubmitEnrollmentApplicationDto
  ) {
    return this.enrollmentService.submitApplication(query, token, dto);
  }

  @Post('acceptWaiver')
  acceptWaiver(
    @Body(QUERY_KEY, new QueryValidationPipe(EnrollmentsQuery)) query: Query<Enrollment>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: AcceptWaiverDto
  ) {
    return this.enrollmentService.acceptWaiver(query, token, dto);
  }

  @Post('processEnrollmentApplication')
  processEnrollmentApplication(
    @Body(QUERY_KEY, new QueryValidationPipe(EnrollmentsSpQuery)) query: Query<Project>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: ProcessEnrollmentApplicationDto
  ) {
    return this.enrollmentService.processEnrollmentApplication(query, token, dto);
  }

  @Post('revertEnrollmentApplication')
  revertEnrollmentApplication(
    @Body(QUERY_KEY, new QueryValidationPipe(EnrollmentsSpQuery)) query: Query<Project>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: RevertEnrollmentApplicationDto
  ) {
    return this.enrollmentService.revertEnrollmentApplication(query, token, dto);
  }

  @Post('retireEnrollment')
  retireEnrollment(
    @Body(QUERY_KEY, new QueryValidationPipe(EnrollmentsSpQuery)) query: Query<Project>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: RetireEnrollmentDto
  ) {
    return this.enrollmentService.retireEnrollment(query, token, dto);
  }
}
