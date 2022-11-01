import { ControlContainer, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ImCheckboxComponent } from './im-checkbox.component';

describe.skip('ImCheckboxComponent', () => {
  let spectator: Spectator<ImCheckboxComponent>;
  const createComponent = createComponentFactory({
    component: ImCheckboxComponent,
    imports: [IonicModule, FormsModule, ReactiveFormsModule],
    providers: [ControlContainer],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
