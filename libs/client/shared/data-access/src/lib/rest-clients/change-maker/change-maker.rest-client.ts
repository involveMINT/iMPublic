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
  IQueryObject,
  IExactQueryObject,
  IExactQuery
 } from '@involvemint/shared/domain';
import { ChangeMakerRestClientInterface } from './change-maker.rest-client.interface';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

export class ChangeMakerRestClient implements ChangeMakerRestClientInterface {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.changeMaker}/`;

  constructor(private http: HttpClient) { }
  
  createProfile(changeMakerQuery: IQuery<ChangeMaker>, dto: CreateChangeMakerProfileDto): Observable<IParser<ChangeMaker, IQuery<ChangeMaker>>>
  {
    const body = {
      QUERY_KEY: changeMakerQuery,
      dto
    };

    return this.http
          .post<IParser<ChangeMaker, IQuery<ChangeMaker>>>(`${this.apiUrl}/createProfile`, body, {
            reportProgress: true,
            observe: 'events',
          })
          .pipe(
            filter((event) => {
              return event.type === HttpEventType.Response;
            }),
            map((event) => {
              switch (event.type) {
                case HttpEventType.Response:
                  return event.body;
              }
            }),
            filter(this.inputIsNotNullOrUndefined)
          );
  }
  editProfile(changeMakerQuery: IExactQuery<ChangeMaker, IQueryObject<ChangeMaker>>, dto: EditCmProfileDto)
  {
    const body = {
      QUERY_KEY: changeMakerQuery,
      dto
    };

    return this.http
          .post<IParser<ChangeMaker, IQuery<ChangeMaker>>>(`${this.apiUrl}/editProfile`, body, {
            reportProgress: true,
            observe: 'events',
          })
          .pipe(
            filter((event) => {
              return event.type === HttpEventType.Response;
            }),
            map((event) => {
              switch (event.type) {
                case HttpEventType.Response:
                  return event.body as IParser<ChangeMaker, IQuery<ChangeMaker>>;
              }
            }),
            filter(this.inputIsNotNullOrUndefined)
          );
  }
  updateProfileImage(changeMakerQuery: IQuery<ChangeMaker>, image: File): Observable<HttpEvent<IParser<ChangeMaker, IQuery<ChangeMaker>>>>
  {
    const body = {
      QUERY_KEY: changeMakerQuery,
      FILES_KEY: image
    };

    return this.http
          .post<IParser<ChangeMaker, IQuery<ChangeMaker>>>(`${this.apiUrl}/editProfile`, body, {
            reportProgress: true,
            observe: 'events',
          })
          .pipe(
            filter((event) => {
              return event.type === HttpEventType.Response || event.type === HttpEventType.UploadProgress;
            })
          );
  }
  
  private inputIsNotNullOrUndefined<T>(input: null | undefined | T): input is T {
    return input !== null && input !== undefined;
  }
  
}