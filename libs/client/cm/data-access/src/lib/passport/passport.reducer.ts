import { PassportDocument, PassportDocumentQuery, IParser } from '@involvemint/shared/domain';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as PassportActions from './passport.actions';

export const PASSPORT_KEY = 'passport';

export type PassportDocumentStoreModel = IParser<PassportDocument, typeof PassportDocumentQuery>;

export interface PassportState {
  documents: EntityState<PassportDocumentStoreModel>;
  loaded: boolean;
}

export const documentsAdapter = createEntityAdapter<PassportDocumentStoreModel>();

const initialState: PassportState = {
  documents: documentsAdapter.getInitialState(),
  loaded: false,
};

export const PassportReducer = createReducer(
  initialState,
  on(
    PassportActions.refreshPassport,
    (state): PassportState => {
      return {
        ...state,
        loaded: false,
      };
    }
  ),
  on(
    PassportActions.loadPassportSuccess,
    (state, { documents }): PassportState => {
      return {
        ...state,
        documents: documentsAdapter.upsertMany(documents, state.documents),
        loaded: true,
      };
    }
  ),
  on(
    PassportActions.createPassportDocumentSuccess,
    (state, { document }): PassportState => {
      return {
        ...state,
        documents: documentsAdapter.upsertOne(document, state.documents),
      };
    }
  ),
  on(
    PassportActions.editPassportDocumentSuccess,
    (state, { document }): PassportState => {
      return {
        ...state,
        documents: documentsAdapter.upsertOne(document, state.documents),
      };
    }
  ),
  on(
    PassportActions.replacePassportDocumentSuccess,
    (state, { document }): PassportState => {
      return {
        ...state,
        documents: documentsAdapter.upsertOne(document, state.documents),
      };
    }
  ),
  on(
    PassportActions.deletePassportDocumentSuccess,
    (state, { deletedId }): PassportState => {
      return {
        ...state,
        documents: documentsAdapter.removeOne(deletedId, state.documents),
      };
    }
  )
);
