import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { RoleService } from 'src/app/service/user/role.service';
import { UserService } from 'src/app/service/user/user.service';

import { RolesComponent } from './roles.component';

describe('RolesComponent', () => {
  let component: RolesComponent;
  let fixture: ComponentFixture<RolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ApolloTestingModule,
        JwtModule.forRoot({}),
        RouterTestingModule,
      ],
      declarations: [ RolesComponent ],
      providers: [
        UserService,
        RoleService,
        AuthenticationService,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
