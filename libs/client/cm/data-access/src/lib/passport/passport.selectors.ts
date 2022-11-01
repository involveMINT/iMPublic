import { createFeatureSelector, createSelector } from '@ngrx/store';
import { documentsAdapter, PassportState, PASSPORT_KEY } from './passport.reducer';

const { selectAll, selectEntities } = documentsAdapter.getSelectors();

const getPassportState = createFeatureSelector<PassportState>(PASSPORT_KEY);

export const getDocuments = createSelector(getPassportState, (state: PassportState) => ({
  documents: selectAll(state.documents),
  loaded: state.loaded,
}));

export const getDocument = (id: string) =>
  createSelector(getPassportState, (state: PassportState) => ({
    document: selectEntities(state.documents)[id],
    loaded: state.loaded,
  }));
