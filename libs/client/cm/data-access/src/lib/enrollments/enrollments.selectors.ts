import { createFeatureSelector, createSelector } from '@ngrx/store';
import { enrollmentsAdapter, EnrollmentsState, ENROLLMENTS_KEY } from './enrollments.reducer';

const { selectAll, selectEntities } = enrollmentsAdapter.getSelectors();

const getEnrollmentsState = createFeatureSelector<EnrollmentsState>(ENROLLMENTS_KEY);

export const getEnrollments = createSelector(getEnrollmentsState, (state: EnrollmentsState) => ({
  enrollments: selectAll(state.enrollments),
  loaded: state.loaded,
}));

export const getEnrollment = (id: string) =>
  createSelector(getEnrollmentsState, (state: EnrollmentsState) => ({
    enrollment: selectEntities(state.enrollments)[id],
    loaded: state.loaded,
  }));
