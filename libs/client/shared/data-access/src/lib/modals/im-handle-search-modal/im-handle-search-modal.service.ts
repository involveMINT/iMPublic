import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  ImHandleSearchModalComponent,
  ImHandleSearchModalInputs,
  ImHandleSearchModalType,
  SearchResult,
} from './im-handle-search-modal.component';

type SearchType<T extends ImHandleSearchModalType.handle | ImHandleSearchModalType.business> =
  T extends ImHandleSearchModalType.handle
    ? SearchResult
    : T extends ImHandleSearchModalType.business
    ? SearchResult['exchangePartner']
    : SearchResult;

@Injectable()
export class ImHandleSearchModalService {
  constructor(private readonly modal: ModalController) {}

  async open<T extends ImHandleSearchModalType.handle | ImHandleSearchModalType.business>(
    type: T,
    inputs: ImHandleSearchModalInputs
  ): Promise<SearchType<T>> {
    const modal = await this.modal.create({
      component: ImHandleSearchModalComponent,
      componentProps: { type, ...inputs },
    });
    await modal.present();
    return (await modal.onDidDismiss()).data as SearchType<T>;
  }
}
