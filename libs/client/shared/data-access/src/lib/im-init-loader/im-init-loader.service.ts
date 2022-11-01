import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { ImInitLoaderComponent } from './im-init-loader.component';

@Injectable()
export class ImInitLoaderService {
  private overlayRef!: OverlayRef;

  constructor(private readonly overlay: Overlay) {}

  show() {
    this.overlayRef = this.overlay.create();
    const userProfilePortal = new ComponentPortal(ImInitLoaderComponent);
    this.overlayRef.attach(userProfilePortal);
  }

  hide() {
    this.overlayRef.detach();
  }
}
