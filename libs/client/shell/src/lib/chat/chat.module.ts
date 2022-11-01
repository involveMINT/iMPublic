import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  ImBlockModule,
  ImHandleModule,
  ImStorageUrlPipeModule,
  ImViewProfileModalModule,
} from '@involvemint/client/shared/data-access';
import { IonicModule } from '@ionic/angular';
import { AutosizeModule } from 'ngx-autosize';
import { ChatComposeComponent } from './chat-compose/chat-compose.component';
import { ChatComponent } from './chat/chat.component';
import { ChatsComponent } from './chats/chats.component';

@NgModule({
  declarations: [ChatsComponent, ChatComposeComponent, ChatComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ImHandleModule,
    AutosizeModule,
    ReactiveFormsModule,
    ImBlockModule,
    ImViewProfileModalModule,
    ImStorageUrlPipeModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChatsComponent,
      },
      {
        path: ':id',
        component: ChatComponent,
      },
    ]),
  ],
})
export class ChatModule {}
