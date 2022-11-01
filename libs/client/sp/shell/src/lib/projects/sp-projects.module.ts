import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  ImagesViewerModalModule,
  ImBlockModule,
  ImHandleModule,
  ImStorageUrlPipeModule,
} from '@involvemint/client/shared/data-access';
import { ImFormsModule, ImImageModule, ImTabsModule } from '@involvemint/client/shared/ui';
import { ConfirmDeactivationGuard } from '@involvemint/client/shared/util';
import { IonicModule } from '@ionic/angular';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProjectUpsertComponent } from './project-upsert/project-upsert.component';
import { ProjectsPageComponent } from './projects-page/projects-page.component';

@NgModule({
  declarations: [ProjectsPageComponent, ProjectUpsertComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImFormsModule,
    ReactiveFormsModule,
    ImTabsModule,
    ImImageModule,
    ImHandleModule,
    ImBlockModule,
    ImStorageUrlPipeModule,
    ImagesViewerModalModule,
    CurrencyMaskModule,
    NgxPaginationModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProjectsPageComponent,
      },
      {
        path: `:id`,
        component: ProjectUpsertComponent,
        canDeactivate: [ConfirmDeactivationGuard],
      },
    ]),
  ],
})
export class SpProjectsModule {}
