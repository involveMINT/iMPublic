import { HttpClient } from '@angular/common/http';
import { CreateProjectDto, DeleteProjectDto, DeleteProjectImageDto, DTO_KEY, environment, FILES_KEY, GetProjectDto, IExactQuery, InvolvemintRoutes, IPagination, IParser, IQuery, Project, ProjectFeedQuery, ProjectSpQuery, ProjectsQueryDto, ProjectsSpDto, QUERY_KEY, UpdateProjectDto, UploadCustomWaiverDto, UploadProjectImageDto } from '@involvemint/shared/domain';
import { Injectable } from '@angular/core';

@Injectable()
export class ProjectRestClient {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.project}`;

  constructor(private http: HttpClient) { }
  
  getAll(query: IQuery<Project[]>, dto: ProjectsQueryDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IPagination<IParser<Project, typeof ProjectFeedQuery>>>(`${this.apiUrl}/getAll`, body);
  }

  getOne(query: IQuery<Project>, dto: GetProjectDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Project, typeof ProjectFeedQuery>>(`${this.apiUrl}/getOne`, body);
  }


  getAllOwnedBySp(query: IQuery<Project[]>, dto: ProjectsSpDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Project, typeof ProjectSpQuery>[]>(`${this.apiUrl}/getAllOwnedBySp`, body);
  }

  create(query: IQuery<Project>, dto: CreateProjectDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Project, typeof ProjectSpQuery>>(`${this.apiUrl}/create`, body);
  }

  update(query: IQuery<Project>, dto: UpdateProjectDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Project, typeof ProjectSpQuery>>(`${this.apiUrl}/update`, body);
  }

  uploadImages(query: IQuery<Project>, dto: UploadProjectImageDto, images: File[]) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto,
      [FILES_KEY]: images
    };

    return this.http
          .post<IParser<Project, typeof ProjectSpQuery>>(`${this.apiUrl}/uploadImages`, body, {
            reportProgress: true,
            observe: 'events',
          });
  }

  deleteImage(query: IQuery<Project>, dto: DeleteProjectImageDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Project, typeof ProjectSpQuery>>(`${this.apiUrl}/deleteImage`, body);
  }

  delete(query: IExactQuery<{ deletedId: string }, { deletedId: true }>, dto: DeleteProjectDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<{ deletedId: string }, { deletedId: true }>>(`${this.apiUrl}/delete`, body);
  }

  uploadCustomWaiver(query: IQuery<Project>, dto: UploadCustomWaiverDto, waiver: File) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto,
      [FILES_KEY]: waiver
    };

    return this.http
          .post<IParser<Project, typeof ProjectSpQuery>>(`${this.apiUrl}/uploadCustomWaiver`, body, {
            reportProgress: true,
            observe: 'events',
          });
  }
}
