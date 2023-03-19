/**
 * The code is a test suite for the PoisComponent component using ngneat/spectator testing 
 * framework.
 * The test suite includes a beforeEach() function that creates an instance of PoisComponent 
 * using the createComponentFactory() method from ngneat/spectator. The createComponentFactory() 
 * method creates a factory function that creates a PoisComponent instance with the specified dependencies, 
 * and providers property is used to provide UserFacade service.
 * The it() function tests whether the component is created or not by checking the toBeTruthy() function. 
 * The test suite also includes an assertion that is intended to fail to show how a failed test looks like.

Note that the fdescribe() function is used to run only this test suite while excluding others.
 */
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
      ]

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
