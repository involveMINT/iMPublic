import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'im-card',
  templateUrl: './im-card.component.html',
  styleUrls: ['./im-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImCardComponent implements OnChanges {
  @Input() title = '';
  @Input() imageUrl = '';
  @Input() progressTitle = '';
  @Input() percent = 0;
  @Input() checkMarks = 2;

  readonly WIDTH = 520;
  readonly HEIGHT = 100;
  readonly OFFSET = 20;
  readonly TOTAL_LENGTH = this.WIDTH - this.OFFSET * 2;

  checkArr: number[] = [];
  barLength = 0;
  scale = 0;

  ngOnChanges() {
    if (this.checkMarks < 2) {
      console.warn('Found im-card component input "checkMarks" to be less than 2. Changing to 2.');
      this.checkMarks = 2;
    }

    this.checkArr = [...Array(this.checkMarks).keys()];
    this.barLength = this.percent * this.TOTAL_LENGTH;
    this.scale = this.TOTAL_LENGTH / (this.checkMarks - 1);
  }
}
