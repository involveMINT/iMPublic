import { ConnectionPositionPair, Overlay, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ElementRef, Injectable, Injector, Type } from '@angular/core';
import { PopoverRef } from './popover-ref';

type PopoverPosition = 'top' | 'right' | 'bottom' | 'left';

interface PopoverParams<Component, Input> {
  /** Origin on where to display `component`. */
  origin: ElementRef | 'bottom';

  /** Component to render inside popover. */
  component: Type<Component>;

  /** Input data to property `component`. */
  data?: Input;

  /** Whether the popover has a backdrop. Defaults to `false`. */
  hasBackdrop?: boolean;

  /** Position of the popover relative to `origin`. Defaults to `top`. */
  position?: PopoverPosition;
}

@Injectable({ providedIn: 'root' })
export class PopoverService {
  constructor(private overlay: Overlay) {}

  open<Component, Input, Output>({
    origin,
    component,
    data,
    hasBackdrop,
    position,
  }: PopoverParams<Component, Input>) {
    const positionStrategy = this.getOverlayPosition(origin, position);

    const overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: hasBackdrop,
    });

    const popoverRef = new PopoverRef<Output>(overlayRef);
    const injector = Injector.create({ providers: [{ provide: PopoverRef, useValue: popoverRef }] });
    const portalRef = overlayRef.attach(new ComponentPortal(component, undefined, injector));

    // Set `component` inputs.
    if (data) {
      for (const [key, value] of Object.entries(data)) {
        portalRef.instance[key as keyof Component] = value;
      }
      portalRef.changeDetectorRef.detectChanges();
    }

    return popoverRef;
  }

  private getOverlayPosition(origin: ElementRef | 'bottom', position?: PopoverPosition): PositionStrategy {
    if (origin === 'bottom') {
      return this.overlay.position().global().centerHorizontally().bottom('0');
    }

    return this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions([this.getPosition(position)])
      .withPush(false);
  }

  private getPosition(position?: PopoverPosition): ConnectionPositionPair {
    switch (position) {
      case 'right':
        return {
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center',
        };

      case 'bottom':
        return {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
        };

      case 'left':
        return {
          originX: 'start',
          originY: 'center',
          overlayX: 'end',
          overlayY: 'center',
        };

      default:
        return {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
        };
    }
  }
}
