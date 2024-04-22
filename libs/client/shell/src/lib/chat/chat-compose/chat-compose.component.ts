import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActiveProfile, HandleRestClient } from '@involvemint/client/shared/data-access';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { ChatMember, Handle, HandleChatQuery, ImConfig, IParser } from '@involvemint/shared/domain';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';

export type ProfileSearchResult = IParser<Handle, typeof HandleChatQuery>;

interface State {
  status: 'init' | 'searching' | 'found';
  activeProfile: ActiveProfile | null;
  handles: ProfileSearchResult[];
  members: ChatMember[];
}

@Component({
  selector: 'involvemint-chat-compose',
  templateUrl: './chat-compose.component.html',
  styleUrls: ['./chat-compose.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComposeComponent extends StatefulComponent<State> implements OnInit {
  private readonly _val = new Subject<string>();

  constructor(private readonly modal: ModalController, private readonly handleRestClient: HandleRestClient) {
    super({ status: 'init', activeProfile: null, handles: [], members: [] });
  }

  ngOnInit(): void {
    this.effect(() =>
      this._val.pipe(
        filter((h) => {
          if (!h) {
            this.updateState({ handles: [], status: 'init' });
            return false;
          }
          this.updateState({ status: 'searching' });
          return true;
        }),
        debounceTime(ImConfig.formDebounceTime),
        switchMap((s) => this.handleRestClient.searchHandles(HandleChatQuery, { handleSearchString: s })),
        tap((handles) => this.updateState({ handles, status: 'found' }))
      )
    );
  }

  search(event: Event): void {
    const input: string = (event as CustomEvent).detail.value;
    this._val.next(input);
  }

  close() {
    return this.modal.dismiss();
  }

  submit() {
    this.modal.dismiss(this.state.members);
  }

  get selectedMembers() {
    return this.state.members.map((member) => `@${member.handleId}`).join(', ');
  }

  select(handleId: string): void {
    if (this.state.members.findIndex((m) => m.handleId === handleId) > -1) {
      this.updateState({ members: this.state.members.filter((m) => m.handleId !== handleId) });
    } else {
      this.state.members.push({ handleId, numberUnread: 0 });
    }
  }

  removeMember(member: ChatMember) {
    const i = this.state.members.findIndex((m) => m.handleId === member.handleId);
    if (i > -1) {
      this.state.members.splice(i, 1);
    }
  }

  memberIncluded(handleId: string) {
    return this.state.members.some((m) => m.handleId === handleId);
  }
}
