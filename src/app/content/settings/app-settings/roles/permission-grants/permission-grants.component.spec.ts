import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermissionService } from 'src/app/service/user/permission.service';

import { PermissionGrantsComponent } from './permission-grants.component';

describe('PermissionGrantsComponent', () => {
  let component: PermissionGrantsComponent;
  let fixture: ComponentFixture<PermissionGrantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionGrantsComponent ],
      providers: [
        PermissionService,
      ]
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
