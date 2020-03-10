import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  isLoggedIn$: Observable<boolean>;
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) { }

  async canActivate() {
    let itCanActivate = false;
    this.isLoggedIn$ = this.authService.isLoggedIn();
    await this.isLoggedIn$.subscribe(isLoggedInResponse => {
      if (isLoggedInResponse) {
        itCanActivate = true;
      } else {
        // not logged in so redirect to login page
        this.router.navigate(['login']);
        itCanActivate = false;
      }
    },
      err => {
        console.log(err);
        itCanActivate = false;
      });
    return itCanActivate;
  }
}
