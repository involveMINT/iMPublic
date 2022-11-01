import { Injectable } from '@angular/core';
import { UserFacade } from '@involvemint/client/shared/data-access';
import { UpdateProjectDto } from '@involvemint/shared/domain';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import * as EnrollmentsSpActions from './enrollments/enrollments.actions';
import { EnrollmentSpStoreModel } from './enrollments/enrollments.reducer';
import * as EnrollmentsSpSelectors from './enrollments/enrollments.selectors';
import * as PoisActions from './pois/pois.actions';
import { PoiSpStoreModel } from './pois/pois.reducer';
import * as PoisSelectors from './pois/pois.selectors';
import * as ProjectsActions from './projects/projects.actions';
import { ProjectSpStoreModel } from './projects/projects.reducer';
import * as ProjectsSelectors from './projects/projects.selectors';
import * as SpAdminsActions from './sp-admins/sp-admins.actions';
import { SpAdminStoreModel } from './sp-admins/sp-admins.reducer';
import * as SpAdminsSelectors from './sp-admins/sp-admins.selectors';

@Injectable()
export class ServePartnerFacade {
  readonly projects = {
    dispatchers: {
      loadProjects: () => {
        this.store.dispatch(ProjectsActions.loadProjects());
      },
      createProject: () => {
        this.store.dispatch(ProjectsActions.createProject());
      },
      updateProject: (dto: UpdateProjectDto) => {
        this.store.dispatch(ProjectsActions.updateProject({ dto }));
      },
      deleteProject: (project: ProjectSpStoreModel) => {
        this.store.dispatch(ProjectsActions.deleteProject({ project }));
      },
      uploadImages: (project: ProjectSpStoreModel, images: File[]) => {
        this.store.dispatch(ProjectsActions.uploadImages({ project, images }));
      },
      deleteImage: (project: ProjectSpStoreModel, index: number) => {
        this.store.dispatch(ProjectsActions.deleteImage({ project, index }));
      },
      refresh: () => {
        this.user.session.selectors.activeProfileSp$.pipe(take(1)).subscribe((sp) => {
          this.store.dispatch(ProjectsActions.refreshProjects({ spId: sp.id }));
        });
      },
      uploadCustomWaiver: (project: ProjectSpStoreModel, file: File) => {
        this.store.dispatch(ProjectsActions.uploadCustomWaiver({ project, file }));
      },
    },
    selectors: {
      projects$: this.user.session.selectors.activeProfileSp$.pipe(
        switchMap((activeAccount) =>
          this.store.pipe(
            select(ProjectsSelectors.getProjects),
            map((state) => {
              const loaded = state.spAccountsLoaded.includes(activeAccount.id);
              if (!loaded) {
                this.store.dispatch(ProjectsActions.loadProjects());
              }
              return {
                loaded,
                projects: state.projects.filter((p) => p.servePartner.id === activeAccount.id),
              };
            })
          )
        )
      ),
      getProject: (projectId: string) =>
        combineLatest([
          this.user.session.selectors.activeProfileSp$,
          this.store.pipe(select(ProjectsSelectors.getProject(projectId))),
        ]).pipe(
          map(([{ id }, state]) => {
            const loaded = state.spAccountsLoaded.includes(id);
            if (!loaded) {
              this.store.dispatch(ProjectsActions.loadProjects());
            }
            return {
              loaded,
              project: state.project?.servePartner.id === id ? state.project : undefined,
            };
          })
        ),
    },
    actionListeners: {
      updateProject: {
        success: this.actions$.pipe(ofType(ProjectsActions.updateProjectSuccess)),
        error: this.actions$.pipe(ofType(ProjectsActions.updateProjectError)),
      },
    },
  };

  readonly enrollments = {
    dispatchers: {
      processEnrollmentApplication: (enrollment: EnrollmentSpStoreModel, approve: boolean) => {
        this.store.dispatch(EnrollmentsSpActions.processEnrollmentApplication({ enrollment, approve }));
      },
      revertBackToPending: (enrollment: EnrollmentSpStoreModel) => {
        this.store.dispatch(EnrollmentsSpActions.revertBackToPending({ enrollment }));
      },
      retireEnrollment: (enrollment: EnrollmentSpStoreModel) => {
        this.store.dispatch(EnrollmentsSpActions.retireEnrollment({ enrollment }));
      },
    },
    selectors: {
      getEnrollmentsByProject: (projectId: string) =>
        this.store.pipe(select(EnrollmentsSpSelectors.getEnrollmentsByProject(projectId))).pipe(
          tap(({ projectsLoaded }) => {
            if (!projectsLoaded.includes(projectId)) {
              this.store.dispatch(EnrollmentsSpActions.loadEnrollments({ projectId }));
            }
          })
        ),
    },
  };

  readonly pois = {
    dispatchers: {
      approve: (poi: PoiSpStoreModel) => {
        this.store.dispatch(PoisActions.approvePoi({ poi }));
      },
    },
    selectors: {
      getPoisByProject: (projectId: string) =>
        this.store.pipe(select(PoisSelectors.getPoisByProject(projectId))).pipe(
          tap(({ projectsLoaded }) => {
            if (!projectsLoaded.includes(projectId)) {
              this.store.dispatch(PoisActions.loadPoisByProject({ projectId }));
            }
          })
        ),
    },
  };

  readonly spAdmins = {
    dispatchers: {
      refresh: () => {
        this.user.session.selectors.activeProfileSp$.pipe(take(1)).subscribe((sp) => {
          this.store.dispatch(SpAdminsActions.refreshSpAdmins({ spId: sp.id }));
        });
      },
      addSpAdmin: (userId: string) => {
        this.store.dispatch(SpAdminsActions.addSpAdmin({ userId }));
      },
      removeSpAdmin: (spAdmin: SpAdminStoreModel) => {
        this.store.dispatch(SpAdminsActions.removeSpAdmin({ spAdmin }));
      },
    },
    selectors: {
      spAdmins$: this.user.session.selectors.activeProfileSp$.pipe(
        switchMap((activeAccount) =>
          this.store.pipe(
            select(SpAdminsSelectors.getState),
            map((state) => {
              const loaded = state.profileLoaded.includes(activeAccount.id);
              if (!loaded) {
                this.store.dispatch(SpAdminsActions.loadSpAdmins());
              }
              return {
                loaded,
                spAdmins: state.spAdmins.filter((p) => p.servePartner.id === activeAccount.id),
              };
            })
          )
        )
      ),
    },
  };

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly user: UserFacade
  ) {}
}
