import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  ChatService,
  HandleRestClient,
  ImViewProfileModalService,
  UserFacade,
  viewProfileCache,
} from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { FormattedChatRoom, Handle, Message, ViewProfileInfoQuery, IParser } from '@involvemint/shared/domain';
import { tapOnce } from '@involvemint/shared/util';
import { IonContent } from '@ionic/angular';
import { combineLatest, forkJoin, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

type ParsedHandle = IParser<Handle, typeof ViewProfileInfoQuery>;

type CR = Omit<FormattedChatRoom, 'members'> & { members: ParsedHandle[] };

interface State {
  chat?: CR;
  profiles: ParsedHandle[];
  loaded: boolean;
  myHandle: string;
  sending: boolean;
}

@Component({
  selector: 'involvemint-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent extends StatefulComponent<State> implements AfterViewInit {
  @ViewChild(IonContent) readonly content?: IonContent;

  readonly messageForm = new FormControl('', [(ac) => Validators.required(ac)]);

  justOpenedChatRoom = true;

  constructor(
    private readonly chatService: ChatService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly uf: UserFacade,
    private readonly change: ChangeDetectorRef,
    private readonly route: RouteService,
    private readonly viewProfileModal: ImViewProfileModalService,
    private readonly handle: HandleRestClient
  ) {
    super({ loaded: false, myHandle: '', sending: false, profiles: [] });
  }

  ngAfterViewInit() {
    const chatId = this.activatedRoute.snapshot.paramMap.get('id');
    if (!chatId) {
      return;
    }
    this.effect(() =>
      combineLatest([this.chatService.get(chatId), this.uf.session.selectors.activeProfile$]).pipe(
        switchMap(([chat, activeProfile]) =>
          forkJoin(
            chat.members.map((m) =>
              viewProfileCache.has(m.handleId)
                ? of(viewProfileCache.get(m.handleId) as ParsedHandle)
                : this.handle
                    .viewProfile(ViewProfileInfoQuery, { handle: m.handleId })
                    .pipe(tap((p) => viewProfileCache.set(p.id, p)))
            )
          ).pipe(
            tap((profiles) => {
              this.updateState({
                profiles,
                chat: {
                  ...chat,
                  members: chat.members.map(
                    (m) =>
                      profiles.find((p) => p.id === m.handleId) as IParser<
                        Handle,
                        typeof ViewProfileInfoQuery
                      >
                  ),
                },
                myHandle: activeProfile.handle.id,
                loaded: true,
              });
            }),
            tapOnce(() => this.content?.scrollToBottom(200)),
            tap(() => {
              const hasUnread = chat.members.find(
                (member) => member.handleId === activeProfile.handle.id && member.numberUnread > 0
              );
              if (hasUnread) {
                // Allow time for the content to scroll
                setTimeout(() => this.chatService.resetUnreadMessages(chat, activeProfile), 200);
              }
              if (!hasUnread) {
                this.justOpenedChatRoom = false;
              }
            })
          )
        )
      )
    );
  }

  back() {
    this.route.to.chat.ROOT({ animation: 'back' });
  }

  async submit(chatRoom: CR) {
    this.updateState({ sending: true });
    await this.chatService.sendMessage(chatRoom.id, this.messageForm.value);
    this.updateState({ sending: false });

    this.messageForm.patchValue('', { emitEvent: false });
    this.change.detectChanges();
    this.content?.scrollToBottom(200);
  }

  trackByCreated(_: number, msg: Message) {
    return msg.createdAt;
  }

  viewProfile(handle: string) {
    this.viewProfileModal.open({ handle });
  }

  getProfilePic(handleId: string) {
    const handle = this.state.profiles.find((p) => p.id === handleId);
    return (
      handle?.changeMaker?.profilePicFilePath ||
      handle?.servePartner?.logoFilePath ||
      handle?.exchangePartner?.logoFilePath ||
      ''
    );
  }

  getName(handleId: string) {
    const handle = this.state.profiles.find((p) => p.id === handleId);
    return (
      `${handle?.changeMaker?.firstName || ''} ${handle?.changeMaker?.lastName || ''}` ||
      handle?.servePartner?.name ||
      handle?.exchangePartner?.name ||
      ''
    );
  }
}
