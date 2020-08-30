import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AurFormViewComponent } from './aur-form-view.component';

describe('AurFormViewComponent', () => {
  let component: AurFormViewComponent;
  let fixture: ComponentFixture<AurFormViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AurFormViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AurFormViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
