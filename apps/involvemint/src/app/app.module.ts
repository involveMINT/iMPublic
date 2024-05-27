import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ClientSharedDataAccessModule, ImInitLoaderModule } from '@involvemint/client/shared/data-access';
import { FRONTEND_ROUTES } from '@involvemint/client/shared/routes';
import { API_URL, environment, ImConfig, ImRoutes } from '@involvemint/shared/domain';
import { routesFactory } from '@involvemint/shared/util';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducer, StoreModule, USER_PROVIDED_META_REDUCERS } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';
import { JoyrideModule } from 'ngx-joyride';
import { fancyAnimation } from './animaitons';
import { AppComponent } from './app.component';
import { ImRouteStrategy } from './route-reuse-strategy';

const ngrxDebugFactory = <T>() => {
  return (reducer: ActionReducer<T>): ActionReducer<T> => {
    return (state, action) => {
      const result = reducer(state, action);
      console.groupCollapsed(action.type);
      console.log('prev state', state);
      console.log('action', action);
      console.log('next state', result);
      console.groupEnd();
      return result;
    };
  };
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      scrollAssist: true,
      scrollPadding: true,
      mode: 'ios',
      navAnimation: fancyAnimation,
    }),
    ClientSharedDataAccessModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseEnv),
    AngularFirestoreModule,
    SuperTabsModule.forRoot(),
    ImInitLoaderModule,
    JoyrideModule.forRoot(),
    RouterModule.forRoot([
      {
        path: '',
        loadChildren: () => import('@involvemint/client/shell').then((m) => m.ClientShellModule),
      },
    ]),
    StoreModule.forRoot([], {
      runtimeChecks: environment.environment === 'production'
        ? {}
        : {
            strictStateImmutability: true,
            strictActionImmutability: true,
            strictStateSerializability: false, // To pass functions.
            strictActionSerializability: false, // To pass error Objects.
            strictActionWithinNgZone: true,
            strictActionTypeUniqueness: true,
          },
    }),
    StoreDevtoolsModule.instrument({
      name: 'INVOLVEMINT',
      // In a production build you would want to disable the Store Devtools.
      logOnly: environment.environment === 'production',
    }),
    EffectsModule.forRoot([]),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.environment === 'production',
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    {
      provide: API_URL,
      useValue: environment.apiUrl,
    },
    {
      provide: RouteReuseStrategy,
      useClass: ImRouteStrategy,
    },
    {
      provide: CURRENCY_MASK_CONFIG,
      useValue: ImConfig.currencyMaskConfig,
    },
    {
      provide: FRONTEND_ROUTES,
      useValue: routesFactory(ImRoutes),
    },
    environment.environment === 'production'
      ? []
      : {
          provide: USER_PROVIDED_META_REDUCERS,
          useFactory: () => [ngrxDebugFactory()],
        },
    environment.environment !== 'local' ?
        []:
        {
          provide: USE_FIRESTORE_EMULATOR,
          useValue: ['localhost', 8080]
        }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
