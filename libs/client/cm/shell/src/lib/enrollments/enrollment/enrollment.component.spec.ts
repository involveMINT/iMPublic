import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChangeMakerFacade } from '@involvemint/frontend/change-maker/data-access';
import { PassportDocumentsModalModule } from '@involvemint/frontend/change-maker/modals';
import { UserFacade } from '@involvemint/frontend/shared/data-access';
import { RouteService } from '@involvemint/frontend/shared/routes';
import { InfoModalModule } from '@involvemint/frontend/shared/utils';
import { IonicModule } from '@ionic/angular';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { EMPTY, of } from 'rxjs';
import { ProjectApplyComponent } from './project-apply.component';

describe.skip('ProjectApplyComponent', () => {
  let spectator: Spectator<ProjectApplyComponent>;
  const createComponent = createComponentFactory({
    component: ProjectApplyComponent,
    imports: [IonicModule, FormsModule, InfoModalModule, PassportDocumentsModalModule],
    mocks: [RouteService],
    providers: [
      mockProvider(ActivatedRoute, { snapshot: { paramMap: { get: () => 'id' } } }),
      mockProvider(UserFacade, {
        profile: { selectors: { profile$: EMPTY } },
      }),
      mockProvider(ChangeMakerFacade, {
        passport: { selectors: { passportDocuments: EMPTY, loaded$: EMPTY } },
        projects: {
          selectors: { getProject: () => of({ projectDocuments: [], servePartner: {} }), loaded$: EMPTY },
          actionListeners: { startApplication: { success: EMPTY } },
        },
        enrollments: {
          selectors: { pending$: EMPTY, current$: EMPTY, denied$: EMPTY, retired$: EMPTY },
          actionListeners: { submitApplication: { success: EMPTY } },
        },
      }),
    ],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
