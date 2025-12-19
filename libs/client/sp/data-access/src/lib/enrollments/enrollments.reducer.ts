import { Enrollment, EnrollmentsSpQuery, IParser } from '@involvemint/shared/domain';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as EnrollmentsSpActions from './enrollments.actions';

export const ENROLLMENTS_SP_FEATURE_KEY = 'enrollmentsSp';

export type EnrollmentSpStoreModel = IParser<Enrollment, typeof EnrollmentsSpQuery>;

export interface State {
  enrollments: EntityState<EnrollmentSpStoreModel>;
  projectsLoaded: string[];
}

export const enrollmentsAdapter = createEntityAdapter<EnrollmentSpStoreModel>();

export const initialState: State = {
  enrollments: enrollmentsAdapter.getInitialState(),
  projectsLoaded: [],
};

export const EnrollmentsSpReducer = createReducer(
  initialState,
  on(
    EnrollmentsSpActions.loadEnrollmentsSuccess,
    (state, { enrollments, dto }): State => ({
      ...state,
      enrollments: enrollmentsAdapter.upsertMany(enrollments, state.enrollments),
      projectsLoaded: [...state.projectsLoaded, dto.projectId],
    })
  ),
  on(
    EnrollmentsSpActions.processEnrollmentApplicationSuccess,
    (state, { enrollment }): State => ({
      ...state,
      enrollments: enrollmentsAdapter.upsertOne(enrollment, state.enrollments),
    })
  ),
  on(
    EnrollmentsSpActions.revertBackToPendingSuccess,
    (state, { enrollment }): State => ({
      ...state,
      enrollments: enrollmentsAdapter.upsertOne(enrollment, state.enrollments),
    })
  ),
  on(
    EnrollmentsSpActions.retireEnrollmentSuccess,
    (state, { enrollment }): State => ({
      ...state,
      enrollments: enrollmentsAdapter.upsertOne(enrollment, state.enrollments),
    })
  )
);
