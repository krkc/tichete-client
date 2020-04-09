import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { User } from '../user';
import { Observable, of } from 'rxjs';
import { UserService } from 'src/app/service/user.service';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserDetailResolverService implements Resolve<User> {

  constructor(private userService: UserService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): User | Observable<User> | Observable<never> {
    let id = route.paramMap.get('id');

    return this.userService.getUser(+id).pipe<User>(
      mergeMap(user => {
        if (user) {
          return of(user);
        } else {
          this.router.navigate(['/users']);
          return null;
        }
      })
    );
  }
}
