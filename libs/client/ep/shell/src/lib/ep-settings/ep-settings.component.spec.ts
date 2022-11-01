import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EpSettingsComponent } from './ep-settings.component';

describe.skip('EpSettingsComponent', () => {
  let component: EpSettingsComponent;
  let fixture: ComponentFixture<EpSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EpSettingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EpSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
