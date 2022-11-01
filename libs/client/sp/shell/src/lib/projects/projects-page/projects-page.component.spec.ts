import { ServePartnerFacade } from '@involvemint/client/serve-partner/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { IonicModule } from '@ionic/angular';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { EMPTY } from 'rxjs';
import { ProjectsPageComponent } from './projects-page.component';

describe.skip('ProjectsPageComponent', () => {
  let spectator: Spectator<ProjectsPageComponent>;
  const createComponent = createComponentFactory({
    component: ProjectsPageComponent,
    imports: [IonicModule],
    mocks: [RouteService],
    providers: [
      mockProvider(ServePartnerFacade, {
        projects: {
          selectors: { projects$: EMPTY, loaded$: EMPTY },
          actionListeners: { loadAllOwnedProjects: { error: EMPTY } },
        },
      }),
    ],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
