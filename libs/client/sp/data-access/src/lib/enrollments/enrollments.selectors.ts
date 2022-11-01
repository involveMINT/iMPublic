import { createFeatureSelector, createSelector } from '@ngrx/store';
import { enrollmentsAdapter, ENROLLMENTS_SP_FEATURE_KEY, State } from './enrollments.reducer';

const getEnrollmentsState = createFeatureSelector<State>(ENROLLMENTS_SP_FEATURE_KEY);

const { selectAll, selectEntities } = enrollmentsAdapter.getSelectors();

export const getEnrollmentsByProject = (projectId: string) =>
  createSelector(getEnrollmentsState, (state: State) => ({
    enrollments: selectAll(state.enrollments).filter((e) => e.project.id === projectId),
    projectsLoaded: state.projectsLoaded,
  }));

export const getEnrollment = (projectId: string) =>
  createSelector(getEnrollmentsState, (state: State) => ({
    enrollment: selectEntities(state.enrollments)[projectId],
    projectsLoaded: state.projectsLoaded,
  }));
