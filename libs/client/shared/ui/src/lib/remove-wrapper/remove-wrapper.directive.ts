import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[imRemoveWrapper]',
})
export class RemoveWrapperDirective implements AfterViewInit {
  constructor(private readonly el: ElementRef) {}

  ngAfterViewInit() {
    const parentElement = this.el.nativeElement.parentElement;
    const element = this.el.nativeElement;
    parentElement.removeChild(element);
    parentElement.parentNode.insertBefore(element, parentElement.nextSibling);
    parentElement.parentNode.removeChild(parentElement);
  }
}
