import { APIOperationError, TransactionDto } from '@involvemint/shared/domain';
import { createAction, props } from '@ngrx/store';
import { ActiveProfile } from '../session/user-session.reducer';
import { TransactionStoreModel } from './transactions.reducer';

export const refreshTransactionsForProfile = createAction(
  '[Transactions] Transactions Refresh For Profile',
  props<{ profile: ActiveProfile }>()
);
export const loadTransactionsForProfile = createAction(
  '[Transactions] Transactions Load For Profile',
  props<{ profile: ActiveProfile }>()
);

export const loadTransactionsForProfileSuccess = createAction(
  '[Transactions] Transactions Load For Profile Success',
  props<{ transactions: TransactionStoreModel[]; profileId: string }>()
);

export const loadTransactionsForProfileError = createAction(
  '[Transactions] Transactions Load For Profile Error',
  props<{ error: APIOperationError }>()
);

/*
    _____                          _   _          
   |_   _| _ __ _ _ _  ___ __ _ __| |_(_)___ _ _  
     | || '_/ _` | ' \(_-</ _` / _|  _| / _ \ ' \ 
     |_||_| \__,_|_||_/__/\__,_\__|\__|_\___/_||_|
                                                  
*/
export const transaction = createAction('[Transactions] Transaction', props<{ dto: TransactionDto }>());

export const transactionSuccess = createAction(
  '[Transactions] Transaction Success',
  props<{ transaction: TransactionStoreModel }>()
);

export const transactionError = createAction(
  '[Transactions] Transaction Error',
  props<{ error: APIOperationError }>()
);
