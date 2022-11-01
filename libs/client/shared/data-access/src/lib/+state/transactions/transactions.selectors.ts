import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ActiveProfile } from '../session/user-session.reducer';
import { transactionsAdapter, TransactionsState, TRANSACTIONS_KEY } from './transactions.reducer';

const { selectAll } = transactionsAdapter.getSelectors();

const getTransactionsState = createFeatureSelector<TransactionsState>(TRANSACTIONS_KEY);

export const getTransactionsByProfile = (profile: ActiveProfile) =>
  createSelector(getTransactionsState, (state: TransactionsState) => ({
    sentTransactions: selectAll(state.transactions).filter(
      (sentTransactions) =>
        sentTransactions.senderChangeMaker?.id === profile.id ||
        sentTransactions.senderExchangePartner?.id === profile.id ||
        sentTransactions.senderServePartner?.id === profile.id
    ),
    receivedTransactions: selectAll(state.transactions).filter(
      (receivedTransactions) =>
        receivedTransactions.receiverChangeMaker?.id === profile.id ||
        receivedTransactions.receiverExchangePartner?.id === profile.id ||
        receivedTransactions.receiverServePartner?.id === profile.id
    ),
    profileLoaded: state.profileLoaded,
  }));
