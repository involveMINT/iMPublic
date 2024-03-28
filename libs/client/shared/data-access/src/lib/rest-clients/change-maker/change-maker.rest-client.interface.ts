import { ChangeMaker, CreateChangeMakerProfileDto, EditCmProfileDto, IParser, IQuery } from '@involvemint/shared/domain';
import { Observable } from 'rxjs';

export interface ChangeMakerRestClientInterface {
  createProfile(changeMakerQuery: IQuery<ChangeMaker>, dto: CreateChangeMakerProfileDto): Observable<IParser<ChangeMaker, IQuery<ChangeMaker>> | null | undefined>;
  editProfile(changeMakerQuery: IQuery<ChangeMaker>, dto: EditCmProfileDto): Observable<IParser<ChangeMaker, IQuery<ChangeMaker>> | null | undefined>;
  updateProfileImage(changeMakerQuery: IQuery<ChangeMaker>, image: File): Observable<unknown>;
}