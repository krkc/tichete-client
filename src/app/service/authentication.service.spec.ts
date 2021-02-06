/* eslint-disable @typescript-eslint/no-unused-vars */

import { TestBed, inject } from '@angular/core/testing';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        JwtModule.forRoot({})
      ],
      providers: [
        AuthenticationService,
      ]
    });
  });

  it('should ...', inject([AuthenticationService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
  }));
});
