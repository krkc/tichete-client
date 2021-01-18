import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Permission } from 'src/app/models/permission';
import { TableFormComponent } from './table-form.component';

describe('TableFormComponent', () => {
  let component: TableFormComponent<Permission>;
  let fixture: ComponentFixture<TableFormComponent<Permission>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent<TableFormComponent<Permission>>(TableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
