import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  isLoggedIn$: Observable<boolean>;
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    this.isLoggedIn$ = this.authService.isLoggedIn();
    this.isLoggedIn$.subscribe(isLoggedInResponse => {
      if (!isLoggedInResponse) {
        // not logged in so redirect to login page
        this.router.navigate(['login']);
      }
    });
    return this.isLoggedIn$;
  }
}
