import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AurFormUpdateComponent } from './aur-form-update.component';

describe('AurFormUpdateComponent', () => {
  let component: AurFormUpdateComponent;
  let fixture: ComponentFixture<AurFormUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AurFormUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AurFormUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
