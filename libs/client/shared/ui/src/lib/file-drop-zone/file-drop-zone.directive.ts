import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[imFileDropZone]',
})
export class FileDropZoneDirective {
  @Output() dropped = new EventEmitter<FileList>();
  @Output() hovered = new EventEmitter<boolean>();

  @HostListener('drop', ['$event'])
  onDrop($event: Event): void {
    $event.preventDefault();
    const event = $event as DragEvent;
    if (event.dataTransfer) {
      this.dropped.emit(event.dataTransfer.files);
      this.hovered.emit(false);
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver($event: Event): void {
    $event.preventDefault();
    this.hovered.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave($event: Event): void {
    $event.preventDefault();
    this.hovered.emit(false);
  }
}
