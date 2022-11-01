import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PhoneMaskModule } from './phone-mask.module';

// Simple test component that will not in the actual app
@Component({
  template: `
    <form [formGroup]="form">
      <input imPhoneMask formControlName="phone" />
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      phone: new FormControl(''),
    });
  }
}

describe.skip('Phone Mask Directive', () => {
  let spectator: Spectator<TestComponent>;
  const createComponent = createComponentFactory({
    component: TestComponent,
    imports: [PhoneMaskModule, FormsModule, ReactiveFormsModule],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should be hold correct format', () => {
    const inp = spectator.query('input') as HTMLInputElement;

    spectator.component.form.setValue({ phone: '' });
    spectator.detectComponentChanges();
    expect(inp.value).toEqual('');

    spectator.component.form.setValue({ phone: '1' });
    spectator.detectComponentChanges();
    expect(inp.value).toEqual('(1)');

    spectator.component.form.setValue({ phone: '1111' });
    spectator.detectComponentChanges();
    expect(inp.value).toEqual('(111) 1');

    spectator.component.form.setValue({ phone: '1111111' });
    spectator.detectComponentChanges();
    expect(inp.value).toEqual('(111) 111-1');

    spectator.component.form.setValue({ phone: '111111111111' });
    spectator.detectComponentChanges();
    expect(inp.value).toEqual('(111) 111-1111');
  });
});
