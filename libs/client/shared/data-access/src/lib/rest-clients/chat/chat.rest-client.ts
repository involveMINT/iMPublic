import { HttpClient, HttpEventType } from '@angular/common/http';
import { InvolvemintRoutes, SendChatMessageDto, environment } from '@involvemint/shared/domain';
import { filter, map } from 'rxjs/operators';

export class ChatRestClient {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.changeMaker}/`;

  constructor(private http: HttpClient) { }

  sendMessage(dto: SendChatMessageDto)
  {
    const body = {
      dto
    };

    return this.http
          .post(`${this.apiUrl}/sendMessage`, body, {
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

  private inputIsNotNullOrUndefined<T>(input: null | undefined | T): input is T {
    return input !== null && input !== undefined;
  }
}
