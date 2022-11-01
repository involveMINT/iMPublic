import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StorefrontComponent } from './storefront.component';

describe.skip('StorefrontComponent', () => {
  let component: StorefrontComponent;
  let fixture: ComponentFixture<StorefrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StorefrontComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StorefrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
