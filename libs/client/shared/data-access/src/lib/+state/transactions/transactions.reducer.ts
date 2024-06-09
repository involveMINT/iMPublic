import { Transaction, TransactionQuery, IParser } from '@involvemint/shared/domain';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as TransactionsActions from './transactions.actions';

export const TRANSACTIONS_KEY = 'transactions';

export type TransactionStoreModel = IParser<Transaction, typeof TransactionQuery>;

export interface TransactionsState {
  transactions: EntityState<TransactionStoreModel>;
  profileLoaded: string[];
}

export const transactionsAdapter = createEntityAdapter<TransactionStoreModel>();

const initialState: TransactionsState = {
  transactions: transactionsAdapter.getInitialState(),
  profileLoaded: [],
};

export const TransactionsReducer = createReducer(
  initialState,
  on(
    TransactionsActions.refreshTransactionsForProfile,
    (state, { profile }): TransactionsState => {
      return {
        ...state,
        profileLoaded: state.profileLoaded.filter((p) => p !== profile.id),
      };
    }
  ),
  on(
    TransactionsActions.loadTransactionsForProfileSuccess,
    (state, { transactions, profileId }): TransactionsState => {
      return {
        ...state,
        transactions: transactionsAdapter.upsertMany(transactions, state.transactions),
        profileLoaded: [...state.profileLoaded, profileId],
      };
    }
  ),
  on(
    TransactionsActions.transactionSuccess,
    (state, { transaction }): TransactionsState => {
      return {
        ...state,
        transactions: transactionsAdapter.upsertOne(transaction, state.transactions),
      };
    }
  )
);
