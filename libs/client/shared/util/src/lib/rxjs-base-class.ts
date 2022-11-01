import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export abstract class RxJSBaseClass implements OnDestroy {
  private _destroy$!: Subject<void>;

  public get destroy$(): Subject<void> {
    if (!this._destroy$) {
      // Performance optimization:
      // Since this is likely used as base component everywhere,
      // only construct a Subject instance if actually used.
      this._destroy$ = new Subject();
    }
    return this._destroy$;
  }

  ngOnDestroy(): void {
    if (this._destroy$) {
      this._destroy$.next();
      this._destroy$.complete();
    }
  }
}
