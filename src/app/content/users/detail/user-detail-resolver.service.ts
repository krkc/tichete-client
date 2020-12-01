import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { User } from '../user';
import { Observable, of } from 'rxjs';
import { UserService } from 'src/app/service/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserDetailResolverService implements Resolve<Observable<User>> {

  constructor(private userService: UserService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Observable<User>> {
    let id = route.paramMap.get('id');
    return of(this.userService.getUser(+id));
  }
}
