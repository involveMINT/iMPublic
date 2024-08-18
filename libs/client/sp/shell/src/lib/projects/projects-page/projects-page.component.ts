import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { ProjectSpStoreModel, ServePartnerFacade } from '@involvemint/client/sp/data-access';
import { calculateProjectExpiry, ProjectStatus, ProjectListingStatus } from '@involvemint/shared/domain';
import { tap } from 'rxjs/operators';

interface State {
  projects: ProjectSpStoreModel[];
  loaded: boolean;
}

@Component({
  selector: 'sp-projects-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsPageComponent extends StatefulComponent<State> implements OnInit {
  constructor(private readonly sp: ServePartnerFacade, private readonly route: RouteService) {
    super({ projects: [], loaded: false });
  }

  ngOnInit(): void {
    this.effect(() =>
      this.sp.projects.selectors.projects$.pipe(
        tap(({ projects, loaded }) => {
          const updatedProjects = projects.map((project) => {
            const status = calculateProjectExpiry(project);
            if (status === ProjectStatus.open) {
              return { ...project, listingStatus: 'public' as ProjectListingStatus };
            }
            else {
              return { ...project, listingStatus: 'private' as ProjectListingStatus };
            }
            return project;
          });
          this.updateState({
            projects: updatedProjects.filter((p) => p.listingStatus === 'public' || p.listingStatus === 'private'),
            loaded,
          });
        })
      )
    );
  }


  refresh() {
    this.sp.projects.dispatchers.refresh();
  }

  projectTrack(_: number, project: ProjectSpStoreModel): string {
    return project.id;
  }

  editProject(project: ProjectSpStoreModel) {
    this.route.to.sp.myProjects.EDIT(project.id, { animation: 'forward' });
  }

  viewProjectCover(project: ProjectSpStoreModel) {
    this.route.to.projects.COVER(project.id);
  }

  async createProject(): Promise<void> {
    this.sp.projects.dispatchers.createProject();
  }
}
