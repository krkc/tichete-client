import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionGrantsComponent } from './permission-grants.component';

describe('PermissionGrantsComponent', () => {
  let component: PermissionGrantsComponent;
  let fixture: ComponentFixture<PermissionGrantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionGrantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionGrantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
