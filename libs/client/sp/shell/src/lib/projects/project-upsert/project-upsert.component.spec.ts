import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ProjectUpsertComponent } from './project-upsert.component';

describe.skip('ProjectUpsertComponent', () => {
  let spectator: Spectator<ProjectUpsertComponent>;
  const createComponent = createComponentFactory(ProjectUpsertComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
