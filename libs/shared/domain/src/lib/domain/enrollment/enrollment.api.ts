import { IQuery } from '../repository';
import { Enrollment } from './enrollment.model';

export interface IEnrollmentAPI {
    get(query: IQuery<Enrollment[]>, token: string): Promise<Enrollment[]>;
}