import { ActivatedRoute } from '@angular/router';
import { ChangeMakerFacade } from '@involvemint/frontend/change-maker/data-access';
import { UserFacade } from '@involvemint/frontend/shared/data-access';
import {
  ImagesViewerModalModule,
  ServePartnerInfoModalModule,
  SpendPartnerInfoModalModule,
} from '@involvemint/frontend/shared/modals';
import { RouteService } from '@involvemint/frontend/shared/routes';
import { ImImageSlidesModule, ImProjectCoverModule } from '@involvemint/frontend/shared/ui';
import { InfoModalModule } from '@involvemint/frontend/shared/utils';
import { IonicModule } from '@ionic/angular';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { EMPTY } from 'rxjs';
import { ProjectCoverPageComponent } from './project-cover-page.component';

describe.skip('ProjectCoverPageComponent', () => {
  let spectator: Spectator<ProjectCoverPageComponent>;
  const createComponent = createComponentFactory({
    component: ProjectCoverPageComponent,
    imports: [
      IonicModule,
      ImagesViewerModalModule,
      ImImageSlidesModule,
      ServePartnerInfoModalModule,
      InfoModalModule,
      SpendPartnerInfoModalModule,
      ImProjectCoverModule,
    ],
    mocks: [RouteService],
    providers: [
      mockProvider(ActivatedRoute, { snapshot: { paramMap: { get: () => 'id' } } }),
      mockProvider(ChangeMakerFacade, {
        projects: {
          selectors: { getProject: () => EMPTY },
          actionListeners: { loadProject: { error: EMPTY } },
        },
        enrollments: {
          selectors: { pending$: EMPTY, current$: EMPTY, denied$: EMPTY, retired$: EMPTY },
          actionListeners: { submitApplication: { success: EMPTY }, startApplication: { success: EMPTY } },
        },
      }),
      mockProvider(UserFacade, { session: { selectors: { allServeAdminAccounts$: EMPTY } } }),
    ],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
