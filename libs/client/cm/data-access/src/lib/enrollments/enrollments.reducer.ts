import { Enrollment, EnrollmentsQuery, IParser } from '@involvemint/shared/domain';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as EnrollmentActions from './enrollments.actions';

export const ENROLLMENTS_KEY = 'enrollments';

export type EnrollmentStoreModel = IParser<Enrollment, typeof EnrollmentsQuery>;

export interface EnrollmentsState {
  enrollments: EntityState<EnrollmentStoreModel>;
  loaded: boolean;
}

export const enrollmentsAdapter = createEntityAdapter<EnrollmentStoreModel>();

const initialState: EnrollmentsState = {
  enrollments: enrollmentsAdapter.getInitialState(),
  loaded: false,
};

export const EnrollmentsReducer = createReducer(
  initialState,
  on(
    EnrollmentActions.refreshEnrollments,
    (state): EnrollmentsState => {
      return {
        ...state,
        loaded: false,
      };
    }
  ),
  on(
    EnrollmentActions.loadEnrollmentsSuccess,
    (state, { enrollments }): EnrollmentsState => {
      return {
        enrollments: enrollmentsAdapter.upsertMany(enrollments, state.enrollments),
        loaded: true,
      };
    }
  ),
  on(
    EnrollmentActions.startApplicationSuccess,
    (state, { enrollment }): EnrollmentsState => {
      return {
        ...state,
        enrollments: enrollmentsAdapter.upsertOne(enrollment, state.enrollments),
      };
    }
  ),
  on(
    EnrollmentActions.withdrawEnrollmentSuccess,
    (state, { deletedId }): EnrollmentsState => {
      return {
        ...state,
        enrollments: enrollmentsAdapter.removeOne(deletedId, state.enrollments),
      };
    }
  ),
  on(
    EnrollmentActions.linkPassportDocumentSuccess,
    (state, { enrollment }): EnrollmentsState => {
      return {
        ...state,
        enrollments: enrollmentsAdapter.upsertOne(enrollment, state.enrollments),
      };
    }
  ),
  on(
    EnrollmentActions.submitApplicationSuccess,
    (state, { enrollment }): EnrollmentsState => {
      return {
        ...state,
        enrollments: enrollmentsAdapter.upsertOne(enrollment, state.enrollments),
      };
    }
  ),
  on(
    EnrollmentActions.acceptWaiverSuccess,
    (state, { enrollment }): EnrollmentsState => {
      return {
        ...state,
        enrollments: enrollmentsAdapter.upsertOne(enrollment, state.enrollments),
      };
    }
  )
);
