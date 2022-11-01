import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

function getWindow(): Window {
  return window;
}

@Injectable({ providedIn: 'root' })
export class WindowRefService {
  constructor(@Inject(PLATFORM_ID) private platformId: Record<string, unknown>) {}

  get nativeWindow(): Window | null {
    if (isPlatformBrowser(this.platformId)) {
      return getWindow();
    }
    return null;
  }
}
