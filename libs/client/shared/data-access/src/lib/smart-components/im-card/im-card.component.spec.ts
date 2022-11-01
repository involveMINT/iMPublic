import { IonicModule } from '@ionic/angular';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';
import { ImCardComponent } from './im-card.component';

describe.skip('ImCardComponent', () => {
  let spectator: SpectatorHost<ImCardComponent>;
  const createHostComponent = createHostFactory({
    component: ImCardComponent,
    imports: [IonicModule],
  });

  it('should create', () => {
    spectator = createHostComponent(`<im-card></im-card>`);

    expect(spectator.component).toBeTruthy();
  });

  it('should display data in proper places (no progress)', () => {
    spectator = createHostComponent(
      `<im-card>
        <div slot="title">title</div>
        <div slot="content">content</div>
        <div slot="left-label">left-label</div>
        <div slot="right-label">right-label</div>
       </im-card>`
    );

    expect(spectator.query('.title')).toHaveText('title');
    expect(spectator.query('.progress')).toBeFalsy();
    expect(spectator.query('[slot=content]')).toHaveText('content');
    expect(spectator.query('[slot=left-label]')).toHaveText('left-label');
    expect(spectator.query('[slot=right-label]')).toHaveText('right-label');
  });

  it('should display data in proper places (with progress)', () => {
    spectator = createHostComponent(
      `<im-card [percent]="0.1" [checkMarks]="5">
        <div slot="title">title</div>
        <div slot="progressTitle">progressTitle</div>
        <div slot="content">content</div>
        <div slot="left-label">left-label</div>
        <div slot="right-label">right-label</div>
       </im-card>`
    );

    expect(spectator.query('[slot=title]')).toHaveText('title');
    expect(spectator.query('[slot=progressTitle]')).toHaveText('progressTitle');
    expect(spectator.query('[slot=content]')).toBeFalsy();
    expect(spectator.query('[slot=left-label]')).toHaveText('left-label');
    expect(spectator.query('[slot=right-label]')).toHaveText('right-label');
  });

  it('progress shows correct number of check mark circles', () => {
    spectator = createHostComponent(
      `<im-card
        [percent]="0.1"
        [checkMarks]="3"
       ></im-card>`
    );
    expect(spectator.queryAll('circle').length).toBe(4);

    spectator.component.percent = 0.49;
    spectator.component.ngOnChanges();
    spectator.detectComponentChanges();
    expect(spectator.queryAll('circle').length).toBe(4);

    spectator.component.percent = 0.5;
    spectator.component.ngOnChanges();
    spectator.detectComponentChanges();
    expect(spectator.queryAll('circle').length).toBe(5);

    spectator.component.percent = 0.9;
    spectator.component.ngOnChanges();
    spectator.detectComponentChanges();
    expect(spectator.queryAll('circle').length).toBe(5);

    spectator.component.percent = 1;
    spectator.component.ngOnChanges();
    spectator.detectComponentChanges();
    expect(spectator.queryAll('circle').length).toBe(6);
  });
});
