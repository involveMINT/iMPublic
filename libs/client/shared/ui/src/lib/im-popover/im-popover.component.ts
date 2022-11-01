import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PopoverRef } from '@involvemint/client/shared/util';

export interface ImPopoverInput {
  content?: string;
  amount?: number;
}

export type ImPopoverOutput = 'dismiss' | 'action';

@Component({
  selector: 'im-popover',
  templateUrl: './im-popover.component.html',
  styleUrls: ['./im-popover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('popover', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(2)' }),
        animate(250, style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate(250, style({ opacity: 0, transform: 'scale(0)' })),
      ]),
    ]),
  ],
})
export class ImPopoverComponent implements Required<ImPopoverInput> {
  @HostBinding('@popover') animation = true;
  @HostBinding('style.max-width') maxWidth = '85vw';

  @Input() set content(c: string) {
    this.safeContent = this.sanitized.bypassSecurityTrustHtml(c);
  }

  @Input() amount!: number;

  safeContent!: ReturnType<DomSanitizer['bypassSecurityTrustHtml']>;

  constructor(
    public readonly el: ElementRef,
    private readonly sanitized: DomSanitizer,
    private readonly popover: PopoverRef<ImPopoverOutput>
  ) {}

  close(type: ImPopoverOutput) {
    this.popover.close(type);
  }
}
