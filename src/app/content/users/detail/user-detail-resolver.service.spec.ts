import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule } from '@auth0/angular-jwt';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { UserService } from 'src/app/service/user.service';

import { UserDetailResolverService } from './user-detail-resolver.service';

describe('UserDetailResolverService', () => {
  let service: UserDetailResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ApolloTestingModule,
        RouterTestingModule,
        JwtModule.forRoot({}),
      ],
      providers: [
        UserService,
        AuthenticationService,
      ],
    });
    service = TestBed.inject(UserDetailResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
