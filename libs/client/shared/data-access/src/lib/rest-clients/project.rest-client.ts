import { HttpClient } from '@angular/common/http';
import { CreateProjectDto, DeleteProjectDto, DeleteProjectImageDto, DTO_KEY, environment, FILES_KEY, GetProjectDto, ExactQuery, InvolvemintRoutes, IPagination, IParser, Query, Project, ProjectFeedQuery, ProjectSpQuery, ProjectsQueryDto, ProjectsSpDto, QUERY_KEY, UpdateProjectDto, UploadCustomWaiverDto, UploadProjectImageDto } from '@involvemint/shared/domain';
import { Injectable } from '@angular/core';

@Injectable()
export class ProjectRestClient {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.project}`;

  constructor(private http: HttpClient) { }
  
  getAll(query: Query<Project[]>, dto: ProjectsQueryDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IPagination<IParser<Project, typeof ProjectFeedQuery>>>(`${this.apiUrl}/getAll`, body);
  }

  getOne(query: Query<Project>, dto: GetProjectDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Project, typeof ProjectFeedQuery>>(`${this.apiUrl}/getOne`, body);
  }


  getAllOwnedBySp(query: Query<Project[]>, dto: ProjectsSpDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Project, typeof ProjectSpQuery>[]>(`${this.apiUrl}/getAllOwnedBySp`, body);
  }

  create(query: Query<Project>, dto: CreateProjectDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Project, typeof ProjectSpQuery>>(`${this.apiUrl}/create`, body);
  }

  update(query: Query<Project>, dto: UpdateProjectDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Project, typeof ProjectSpQuery>>(`${this.apiUrl}/update`, body);
  }

  uploadImages(query: Query<Project>, dto: UploadProjectImageDto, images: File[]) {
    const body = new FormData();
    body.set(QUERY_KEY, JSON.stringify(query));
    body.set(DTO_KEY, JSON.stringify(dto));
    images.forEach((file) => body.append(FILES_KEY, file, file.name));

    return this.http
          .post<IParser<Project, typeof ProjectSpQuery>>(`${this.apiUrl}/uploadImages`, body, {
            reportProgress: true,
            observe: 'events',
          });
  }

  deleteImage(query: Query<Project>, dto: DeleteProjectImageDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Project, typeof ProjectSpQuery>>(`${this.apiUrl}/deleteImage`, body);
  }

  delete(query: ExactQuery<{ deletedId: string }, { deletedId: true }>, dto: DeleteProjectDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<{ deletedId: string }, { deletedId: true }>>(`${this.apiUrl}/delete`, body);
  }

  uploadCustomWaiver(query: Query<Project>, dto: UploadCustomWaiverDto, waiver: File) {
    const body = new FormData();
    body.set(QUERY_KEY, JSON.stringify(query));
    body.set(DTO_KEY, JSON.stringify(dto));
    body.append(FILES_KEY, waiver, waiver.name);

    return this.http
          .post<IParser<Project, typeof ProjectSpQuery>>(`${this.apiUrl}/uploadCustomWaiver`, body, {
            reportProgress: true,
            observe: 'events',
          });
  }
}
