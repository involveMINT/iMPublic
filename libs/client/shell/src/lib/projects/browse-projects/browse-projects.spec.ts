import { ChangeMakerFacade } from '@involvemint/frontend/change-maker/data-access';
import { RouteService } from '@involvemint/frontend/shared/routes';
import { ImCardModule } from '@involvemint/frontend/shared/ui';
import { IonicModule } from '@ionic/angular';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { EMPTY } from 'rxjs';
import { BrowseProjectsPage } from './browse-projects.page';

describe.skip('BrowseProjectsPage', () => {
  let spectator: Spectator<BrowseProjectsPage>;
  const createComponent = createComponentFactory({
    component: BrowseProjectsPage,
    imports: [IonicModule, ImCardModule],
    mocks: [RouteService],
    providers: [
      mockProvider(ChangeMakerFacade, {
        projects: { selectors: { browse$: EMPTY } },
        enrollments: { selectors: { current$: EMPTY, pending$: EMPTY } },
      }),
    ],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
