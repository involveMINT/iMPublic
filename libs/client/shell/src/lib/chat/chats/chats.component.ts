import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActiveProfile, ChatService, UserFacade } from '@involvemint/client/shared/data-access';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { ChatMember, FormattedChatRoom, getUnreadMessagesCount } from '@involvemint/shared/domain';
import { ModalController } from '@ionic/angular';
import { compareDesc } from 'date-fns';
import lodash from 'lodash';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { ChatComposeComponent } from '../chat-compose/chat-compose.component';

interface State {
  chats: FormattedChatRoom[];
  loaded: boolean;
  activeProfile: ActiveProfile | null;
}

@Component({
  selector: 'involvemint-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatsComponent extends StatefulComponent<State> {
  private searchStr$ = new BehaviorSubject<string>('');

  readonly getMyChats = this.effect(() =>
    combineLatest([this.chatService.store$, this.searchStr$, this.uf.session.selectors.activeProfile$]).pipe(
      tap(([{ myChats }, searchStr, activeProfile]) => {
        const chats = myChats
          .filter((room) => {
            if (searchStr === '') {
              return true;
            }
            const roomMembers = room.members.filter((member) => member.handleId !== activeProfile.handle.id);
            return roomMembers.some((member) => member.handleId.search(searchStr) >= 0);
          })
          .sort((a, b) => compareDesc(a.lastMessage, b.lastMessage));
        this.updateState({ activeProfile, chats, loaded: true });
      })
    )
  );

  constructor(
    private readonly chatService: ChatService,
    private readonly uf: UserFacade,
    private readonly modal: ModalController
  ) {
    super({ chats: [], loaded: false, activeProfile: null });
  }

  async newChatRoom() {
    const activeProfile = await this.uf.session.selectors.activeProfile$
      .pipe(take(1), takeUntil(this.destroy$))
      .toPromise();
    const modal = await this.modal.create({ component: ChatComposeComponent });
    await modal.present();
    const members: ChatMember[] = (await modal.onDidDismiss()).data;
    if (members && members.length > 0) {
      // Check to see if chat room already exists
      const selectedMemberIds = [...members.map((m) => m.handleId), activeProfile.handle.id];
      let roomAlreadyExistsWithSelectedMembers = '';
      for (const chatRoom of this.state.chats) {
        const roomMemberIds = chatRoom.members.map((m) => m.handleId);
        // If the the xor of any of the existing chatRoom's members is an empty array,
        // then that room already exists since the members are equal
        if (lodash.xor(selectedMemberIds, roomMemberIds).length === 0) {
          roomAlreadyExistsWithSelectedMembers = chatRoom.id;
          break;
        }
      }
      if (roomAlreadyExistsWithSelectedMembers) {
        this.chatService.goToChatRoom(roomAlreadyExistsWithSelectedMembers);
      } else {
        this.chatService.upsert(members);
      }
    }
  }

  chatRoom(id: string) {
    return this.chatService.goToChatRoom(id);
  }

  getUnreadForRoom(myHandle: string, room: FormattedChatRoom) {
    return getUnreadMessagesCount(myHandle, [room]);
  }

  search(event: Event): void {
    const input: string = (event as CustomEvent).detail.value;
    this.searchStr$.next(input);
  }
}
