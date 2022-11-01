import { AdminFacade } from '@involvemint/client/admin/data-access';
import { UserFacade } from '@involvemint/client/shared/data-access';
import { IonicModule } from '@ionic/angular';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { EMPTY } from 'rxjs';
import { PrivilegesComponent } from './privileges.component';
import { PrivilegesComponentStore } from './privileges.component-store';

describe.skip('PrivilegesComponent', () => {
  let spectator: Spectator<PrivilegesComponent>;
  const createComponent = createComponentFactory({
    component: PrivilegesComponent,
    imports: [IonicModule],
    mocks: [UserFacade, PrivilegesComponentStore],
    providers: [
      mockProvider(AdminFacade, {
        privileges: { selectors: { srPrivileges$: EMPTY, spPrivileges$: EMPTY, loaded$: EMPTY } },
      }),
    ],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
