import { HttpClient } from '@angular/common/http';
import { DeleteSpImageDto, DTO_KEY, EditSpProfileDto, environment, FILES_KEY, InvolvemintRoutes, IParser, IQuery, QUERY_KEY, ServePartner, UpdateSpLogoFileDto, UploadSpImagesDto, UserQuery } from '@involvemint/shared/domain';
import { Injectable } from '@angular/core';

@Injectable()
export class ServePartnerRestClient {

  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.servePartner}`;

  constructor(private http: HttpClient) { }

  editProfile(query: IQuery<ServePartner>, dto: EditSpProfileDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<ServePartner, typeof UserQuery.serveAdmins.servePartner>>(`${this.apiUrl}/editProfile`, body);
  }

  updateLogoFile(query: IQuery<ServePartner>, dto: UpdateSpLogoFileDto, logo: File) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto,
      [FILES_KEY]: logo
    };

    return this.http
          .post<IParser<ServePartner, typeof UserQuery.serveAdmins.servePartner>>(`${this.apiUrl}/updateLogoFile`, body, {
            reportProgress: true,
            observe: 'events',
          });
  }

  uploadImages(query: IQuery<ServePartner>, dto: UploadSpImagesDto, files: File[]) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto,
      [FILES_KEY]: files
    };

    return this.http
          .post<IParser<ServePartner, typeof UserQuery.serveAdmins.servePartner>>(`${this.apiUrl}/uploadImages`, body, {
            reportProgress: true,
            observe: 'events',
          });
  }

  deleteImage(query: IQuery<ServePartner>, dto: DeleteSpImageDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto,
    };

    return this.http
          .post<IParser<ServePartner, typeof UserQuery.serveAdmins.servePartner>>(`${this.apiUrl}/deleteImage`, body);
  }
}
