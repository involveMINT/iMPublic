import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientCmApiModule } from '@involvemint/client/cm/api';
import {
  ImBlockModule,
  ImCardModule,
  ImLoadingRouteDirectiveModule,
  ImStorageUrlPipeModule,
  ImViewProfileModalModule,
} from '@involvemint/client/shared/data-access';
import { IonicModule } from '@ionic/angular';
import { BrowseProjectsComponent } from './browse-projects/browse-projects.component';
import { ProjectCoverPageComponent } from './project-cover-page/project-cover-page.component';
import { LocationPermissionModalModule } from '../location-permission-modal/location-permission-modal.module';
import { LocationPermissionModalService } from '../location-permission-modal/location-permission-modal.service';

@NgModule({
  declarations: [BrowseProjectsComponent],
  exports: [BrowseProjectsComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImBlockModule,
    ClientCmApiModule,
    ImStorageUrlPipeModule,
    ImCardModule,
    ImLoadingRouteDirectiveModule,
    ImViewProfileModalModule,

  ],
  providers: [LocationPermissionModalService]
})
export class BrowseProjectsModule {}

@NgModule({
  declarations: [ProjectCoverPageComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImBlockModule,
    ClientCmApiModule,
    ImStorageUrlPipeModule,
    ImCardModule,
    ImLoadingRouteDirectiveModule,
    BrowseProjectsModule,
    ImViewProfileModalModule,
    LocationPermissionModalModule,
    RouterModule.forChild([
      {
        path: '',
        component: BrowseProjectsComponent,
      },
      {
        path: ':id',
        component: ProjectCoverPageComponent,
      },
    ]),
  ],
})
export class ProjectsModule {}
