import { EnrollmentService } from '@involvemint/server/core/application-services';
import { Enrollment, IEnrollmentAPI, InvolvemintRoutes } from '@involvemint/shared/domain';
import {
    Controller,
    Post
  } from '@nestjs/common';
import { IPaginate } from '@orcha/common';
import { IQueryObject } from '@orcha/common/src/lib/query';

@Controller(InvolvemintRoutes.enrollment)
export class EnrollmentController implements IEnrollmentAPI {
    constructor(private readonly enrollmentService: EnrollmentService) {}

    @Post('get')
    get(query: IQueryObject<Enrollment> & IPaginate, token: string): Promise<Enrollment[]> {
       return this.enrollmentService.get(query, token);
    }

}