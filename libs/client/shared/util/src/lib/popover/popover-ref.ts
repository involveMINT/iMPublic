import { OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';

export class PopoverRef<Output> {
  private afterClosed = new Subject<Output>();
  afterClosed$ = this.afterClosed.asObservable();

  constructor(public overlay: OverlayRef) {}

  close(data?: Output) {
    this.overlay.detach();
    this.afterClosed.next(data);
    this.afterClosed.complete();
  }
}
