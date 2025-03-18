import { 
  ChangeMaker, 
  CreateChangeMakerProfileDto, 
  EditCmProfileDto, 
  IParser, 
  IQuery, 
  InvolvemintRoutes, 
  environment,
  QUERY_KEY,
  FILES_KEY,
  IExactQuery,
  UserQuery,
  DTO_KEY
 } from '@involvemint/shared/domain';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ChangeMakerRestClient {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.changeMaker}`;

  constructor(private http: HttpClient) { }
  
  createProfile(query: IQuery<ChangeMaker>, dto: CreateChangeMakerProfileDto): Observable<IParser<ChangeMaker, typeof UserQuery.changeMaker>>
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<ChangeMaker, typeof UserQuery.changeMaker>>(`${this.apiUrl}/createProfile`, body);
  }
  editProfile(changeMakerQuery: IExactQuery<ChangeMaker, typeof UserQuery.changeMaker>, dto: EditCmProfileDto)
  {
    const body = {
      [QUERY_KEY]:changeMakerQuery,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<ChangeMaker, IExactQuery<ChangeMaker, typeof UserQuery.changeMaker>>>(`${this.apiUrl}/editProfile`, body)
  }
  updateProfileImage(changeMakerQuery: IQuery<ChangeMaker>, image: File): Observable<HttpEvent<IParser<ChangeMaker, typeof UserQuery.changeMaker>>>
  {
    const body = new FormData();
    body.set(QUERY_KEY, JSON.stringify(changeMakerQuery));
    body.set(FILES_KEY, image, image.name);

    return this.http
          .post<IParser<ChangeMaker, typeof UserQuery.changeMaker>>(`${this.apiUrl}/updateProfileImage`, body, {
            reportProgress: true,
            observe: 'events',
          });
  }
}