import { IQuery } from '@orcha/common';
import { Enrollment } from './enrollment.model';

export interface IEnrollmentAPI {
    get(query: IQuery<Enrollment[]>, token: string): Promise<Enrollment[]>;
}