import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { IonicModule } from '@ionic/angular';
import { RemoveWrapperModule } from '../remove-wrapper/remove-wrapper.module';
import { ImTabComponent } from './im-tab/im-tab.component';
import { ImTabsComponent } from './im-tabs.component';
import { ImSuperTabsToolbarThemeDirective } from './super-tabs-toolbar-style/super-tabs-toolbar-style.directive';

@NgModule({
  declarations: [ImTabsComponent, ImTabComponent, ImSuperTabsToolbarThemeDirective],
  imports: [CommonModule, IonicModule, SuperTabsModule, RemoveWrapperModule],
  exports: [ImTabsComponent, ImTabComponent],
})
export class ImTabsModule {}
export { ImTabsComponent };
