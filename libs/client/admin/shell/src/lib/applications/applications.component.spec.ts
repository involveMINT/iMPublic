import { AdminFacade } from '@involvemint/client/admin/data-access';
import { UserFacade } from '@involvemint/client/shared/data-access';
import { IonicModule } from '@ionic/angular';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { EMPTY } from 'rxjs';
import { ApplicationsComponent } from './applications.component';
import { ApplicationsComponentStore } from './applications.component-store';

describe.skip('ApplicationsComponent', () => {
  let spectator: Spectator<ApplicationsComponent>;
  const createComponent = createComponentFactory({
    component: ApplicationsComponent,
    imports: [IonicModule],
    mocks: [UserFacade, ApplicationsComponentStore],
    providers: [
      mockProvider(AdminFacade, {
        applications: { selectors: { srApplications$: EMPTY, spApplications$: EMPTY, loaded$: EMPTY } },
      }),
    ],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
