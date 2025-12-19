import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DTO_KEY, InvolvemintRoutes, SendChatMessageDto, environment } from '@involvemint/shared/domain';

@Injectable()
export class ChatRestClient {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.chat}`;

  constructor(private http: HttpClient) { }

  sendMessage(dto: SendChatMessageDto)
  {
    const body = {
      [DTO_KEY]: dto
    };

    return this.http
          .post(`${this.apiUrl}/sendMessage`, body);
  }
}
