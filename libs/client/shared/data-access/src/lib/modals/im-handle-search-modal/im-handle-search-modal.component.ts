import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { GenericHandleSearchQuery, Handle, ImConfig, IParser } from '@involvemint/shared/domain';
import { ModalController } from '@ionic/angular';
import { FormControl } from '@ngneat/reactive-forms';
import { debounceTime, filter, map, switchMap } from 'rxjs/operators';
import { HandleRestClient } from '../../rest-clients';

export enum ImHandleSearchModalType {
  handle = 'handle',
  business = 'business',
}

export interface ImHandleSearchModalInputs {
  title: string;
  header?: string;
}

export type SearchResult = IParser<Handle, typeof GenericHandleSearchQuery>;

interface State {
  searchResult: SearchResult[];
  status: 'init' | 'loading' | 'done';
}

@Component({
  selector: 'im-handle-search-modal',
  templateUrl: './im-handle-search-modal.component.html',
  styleUrls: ['./im-handle-search-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImHandleSearchModalComponent
  extends StatefulComponent<State>
  implements OnInit, ImHandleSearchModalInputs
{
  @Input() type = ImHandleSearchModalType.handle;
  @Input() title = 'Search For User';
  @Input() header?: string;

  readonly search = new FormControl('');

  constructor(private readonly handleRestClient: HandleRestClient, private readonly modal: ModalController) {
    super({
      searchResult: [],
      status: 'init',
    });
  }

  get ImHandleSearchModalType() {
    return ImHandleSearchModalType;
  }

  ngOnInit(): void {
    this.effect(() =>
      this.search.valueChanges.pipe(
        filter((search) => {
          if (!search) {
            this.updateState({
              searchResult: [],
              status: 'init',
            });
            return false;
          }
          this.updateState({ status: 'loading' });
          return true;
        }),
        debounceTime(ImConfig.formDebounceTime),
        switchMap((s) =>
          this.handleRestClient.genericSearch(GenericHandleSearchQuery, { search: s }).pipe(
            map((handles) => {
              this.updateState({
                searchResult: handles.filter((h) => {
                  switch (this.type) {
                    case ImHandleSearchModalType.handle:
                      return true;
                    case ImHandleSearchModalType.business:
                      return h.exchangePartner;
                    default:
                      return true;
                  }
                }),
                status: 'done',
              });
            })
          )
        )
      )
    );
  }

  select(selected: SearchResult | SearchResult['changeMaker'] | SearchResult['exchangePartner']) {
    this.modal.dismiss(selected);
  }

  close() {
    this.modal.dismiss(undefined);
  }
}
