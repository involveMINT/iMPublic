import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AdminFacade } from '@involvemint/client/admin/data-access';
import {
  ImHandleSearchModalService,
  ImHandleSearchModalType,
  SearchResult,
} from '@involvemint/client/shared/data-access';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { FormControl } from '@ngneat/reactive-forms';

interface State {
  user: SearchResult | null;
}

@Component({
  selector: 'admin-feature-partners-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintComponent extends StatefulComponent<State> {
  readonly amount = new FormControl<number>(0);

  constructor(private readonly af: AdminFacade, private readonly handleSearch: ImHandleSearchModalService) {
    super({ user: null });
  }

  async openProfileSearchModal() {
    const user = await this.handleSearch.open(ImHandleSearchModalType.handle, {
      title: 'Select handle to receive CC',
    });
    if (user) {
      this.updateState({ user });
    }
  }

  mint() {
    const handle = this.state.user?.id;
    if (handle) {
      this.af.credits.dispatchers.mint({
        handle,
        amount: this.amount.value * 100,
      });
    }
  }
}
