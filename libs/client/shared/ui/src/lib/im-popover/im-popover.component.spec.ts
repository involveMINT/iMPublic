import { CommonModule } from '@angular/common';
import { PopoverRef } from '@involvemint/client/shared/util';
import { IonicModule } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ImPopoverComponent } from './im-popover.component';

describe.skip('ImPopoverComponent', () => {
  let spectator: Spectator<ImPopoverComponent>;
  const createComponent = createComponentFactory({
    component: ImPopoverComponent,
    imports: [CommonModule, IonicModule],
    mocks: [PopoverRef],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should call dismiss upon close button top right', () => {
    spectator.click('ion-icon[name="close-circle"]');
    expect(spectator.component['popover'].close).toBeCalledWith('dismiss');
  });

  it('should call action upon clicking content', () => {
    spectator.click('.cont');
    expect(spectator.component['popover'].close).toBeCalledWith('action');
  });
});
