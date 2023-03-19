import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PoisComponent } from './activityposts.component';
import { RouteService } from '@involvemint/client/shared/routes';
import { IonicModule } from '@ionic/angular';
import { CommentService, ImBlockModule, UserFacade } from '@involvemint/client/shared/data-access';
import { ChangeMakerFacade, EnrollmentsModalService } from '@involvemint/client/cm/data-access';
import { of } from 'rxjs';

fdescribe('Activity Posts Component', () => {
  let userFacade: UserFacade;
  let spectator: Spectator<PoisComponent>;

  const createComponent = createComponentFactory(
    {
      component: PoisComponent,
      imports: [IonicModule.forRoot(), ImBlockModule],
      mocks: [
        RouteService,
        ChangeMakerFacade,
        EnrollmentsModalService,
        UserFacade,
        CommentService
      ],
     

      // declarations: [ImBlockComponent],
    });

  beforeEach(() => {
    userFacade = {
      posts: {
        selectors: {
          posts$: of([])
        }
      }
    } as any;
    spectator = createComponent({
      providers: [
        { provide: UserFacade, useValue: userFacade }]
    });

    });
  it('should create', () => {

    expect(spectator.component).toBeTruthy();
    expect(true).toEqual(false);
  });
});
