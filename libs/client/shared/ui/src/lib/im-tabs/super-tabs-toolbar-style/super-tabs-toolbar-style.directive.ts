import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[imSuperTabsToolbarTheme]',
})
export class ImSuperTabsToolbarThemeDirective {
  constructor(private readonly el: ElementRef) {
    const stylesheet = `
      super-tab-indicator {
        height: 100%;
        width: 100px;
        z-index: -1;
        background-color: var(--im-menu-item-active);
      }
      `;

    const styleElement = this.el.nativeElement.shadowRoot?.querySelector('style');

    if (styleElement) styleElement.append(stylesheet);
    else {
      const barStyle = document.createElement('style');
      barStyle.append(stylesheet);
      this.el.nativeElement.shadowRoot?.appendChild(barStyle);
    }
  }
}
