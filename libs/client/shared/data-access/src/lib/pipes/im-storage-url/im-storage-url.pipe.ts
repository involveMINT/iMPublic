import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { StorageRestClient } from '../../rest-clients/storage.rest-client';

const cache = new Map<string, string>();

@Pipe({ name: 'imStorageUrl' })
export class ImStorageUrlPipe implements PipeTransform {
  constructor(private readonly storage: StorageRestClient, private readonly sanitizer: DomSanitizer) {}

  transform(path?: string, iframe?: boolean): Observable<string>;
  transform(path?: string[], iframe?: boolean): Observable<string[]>;
  transform(path?: string | string[], iframe?: boolean): Observable<string | string[]> {
    if (Array.isArray(path)) {
      return this.callMultiple(path, iframe);
    } else {
      return this.callSingle(path, iframe);
    }
  }

  private callMultiple(paths: string[], iframe?: boolean) {
    return combineLatest(paths.filter((p) => p).map((p) => this.callSingle(p, iframe)));
  }

  private callSingle(path?: string, iframe?: boolean) {
    if (!path) {
      return of(this.sanitize('', iframe));
    }

    if (path.startsWith('https://')) {
      return of(this.sanitize(path, iframe));
    }

    const cachedUrl = cache.get(path);
    if (cachedUrl) {
      return of(cachedUrl);
    }

    const actualPath = path?.split('?')[0] ?? '';
    return this.storage.getUrl({ url: true }, { path: actualPath }).pipe(
      map(({ url }) => {
        const sanitized = this.sanitize(url, iframe);
        if (path) cache.set(path, sanitized);
        return sanitized;
      }),
      catchError(() => of(this.sanitize('assets/no-img.png', iframe))),
      startWith(this.sanitize('/assets/loading.gif', iframe))
    );
  }

  private sanitize(url: string, iframe?: boolean): string {
    return iframe ? (this.sanitizer.bypassSecurityTrustResourceUrl(url) as string) : url;
  }
}
