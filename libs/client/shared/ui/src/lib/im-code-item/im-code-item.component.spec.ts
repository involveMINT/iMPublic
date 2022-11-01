import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';
import { ImCodeItemComponent } from './im-code-item.component';

describe.skip('ImCodeItemComponent', () => {
  let spectator: SpectatorHost<ImCodeItemComponent>;
  const createHostComponent = createHostFactory({
    component: ImCodeItemComponent,
    imports: [CommonModule, IonicModule],
  });

  it('should create', () => {
    spectator = createHostComponent(`<im-code-item></im-code-item>`);
    expect(spectator.component).toBeTruthy();
  });

  it('should show code', () => {
    spectator = createHostComponent(`<im-code-item code="code"></im-code-item>`);
    expect(spectator.queryHost('.code')).toHaveText('code');
  });

  it('should show price', () => {
    spectator = createHostComponent(`<im-code-item price="100"></im-code-item>`);
    expect(spectator.queryHost('.price')).toHaveText('1.00');
  });

  it('should show ngTemplate', () => {
    spectator = createHostComponent(`
      <im-code-item>
          body-text
      </im-code-item>`);
    expect(spectator.queryHost('im-code-item')).toHaveText('body-text');
  });
});
