import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { RxJSBaseClass } from '@involvemint/client/shared/util';
import { takeUntil, tap } from 'rxjs/operators';
import { UserFacade } from '../../+state/user.facade';

@Component({
  selector: 'im-route-loader',
  template: `
    <ng-template #myTemplate>
      <div [style.width]="width" [style.height]="height" class="cont">
        <ion-spinner
          name="crescent"
          slot="icon-only"
          [style.color]="'var(--ion-color-primary)'"
        ></ion-spinner>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .cont {
        display: grid;
        place-content: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImRouteLoaderComponent {
  public template!: TemplateRef<unknown>;
  @ViewChild('myTemplate', { static: true }) myTemplate!: TemplateRef<unknown>;
  width = '';
  height = '';
}

@Directive({ selector: '[imLoadingRoute]' })
export class ImLoadingRouteDirective extends RxJSBaseClass implements OnInit {
  @Input() imLoadingRoute = '';

  constructor(
    private readonly user: UserFacade,
    private readonly template: TemplateRef<unknown>,
    private readonly container: ViewContainerRef,
    private readonly resolver: ComponentFactoryResolver,
    private readonly change: ChangeDetectorRef,
    private readonly el: ElementRef
  ) {
    super();
  }

  ngOnInit() {
    this.user.session.selectors.loadingRoute$
      .pipe(
        tap((loadingRoute) => {
          if (loadingRoute.includes(this.imLoadingRoute)) {
            const width = this.el.nativeElement.previousElementSibling.offsetWidth;
            const height = this.el.nativeElement.previousElementSibling.offsetHeight;
            this.container.clear();
            const compFactory = this.resolver.resolveComponentFactory(ImRouteLoaderComponent);
            const componentRef = compFactory.create(this.container.injector);
            componentRef.instance.width = `${width}px`;
            componentRef.instance.height = `${height}px`;
            this.container.createEmbeddedView(componentRef.instance.myTemplate);
          } else {
            this.container.clear();
            this.container.createEmbeddedView(this.template);
          }
          this.change.detectChanges();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
