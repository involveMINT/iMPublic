import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';
import { ImErrorComponent } from '../im-error/im-error.component';
import { ImItemComponent } from './im-item.component';

@Component({
  selector: 'im-dummy',
  template: `
    <form [formGroup]="form">
      <im-item [touched]="true">
        <input formControlName="name" />
      </im-item>
    </form>
  `,
})
class DummyComponent {
  form = this.fb.group({ name: new FormControl('', (ac) => Validators.required(ac)) });

  constructor(private readonly fb: FormBuilder) {}
}

describe.skip('ImItemComponent', () => {
  let spectator: SpectatorHost<ImItemComponent>;
  const createHostComponent = createHostFactory({
    component: ImItemComponent,
    declarations: [ImErrorComponent, DummyComponent],
    imports: [IonicModule, FormsModule, ReactiveFormsModule],
  });

  it('should create', () => {
    spectator = createHostComponent(`<im-item></im-item>`);

    expect(spectator.component).toBeTruthy();
  });

  it('should show proper ng-content', () => {
    spectator = createHostComponent(`
    <im-item>
      <div slot="start"></div>
      <input />
      <div slot="end"></div>
      <im-error></im-error>
      <div slot="idk"></div>
    </im-item>`);

    expect(spectator.query('[slot=start]')).toBeTruthy();
    expect(spectator.query('input')).toBeTruthy();
    expect(spectator.query('[slot=end]')).toBeTruthy();
    expect(spectator.query('im-error')).toBeTruthy();
  });

  it('should show red border when there is an error', () => {
    spectator = createHostComponent(`<im-dummy></im-dummy>`);
    expect((spectator.query('ion-item') as HTMLIonItemElement).className).toBe('');
    spectator.queryHost(DummyComponent)?.form.markAllAsTouched();
    spectator.component.ngAfterContentChecked();
    expect((spectator.query('ion-item') as HTMLIonItemElement).className).toBe('error');
  });
});
