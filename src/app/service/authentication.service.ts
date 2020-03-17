import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";

import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { User } from '../content/users/user';

@Injectable()
export class AuthenticationService {
  private apiUrl = 'api';
  private loginUrl = 'api/auth/login';
  private registerUrl = 'api/auth/register';
  private headers: HttpHeaders;
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private options;

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('current_user')));
    this.currentUser = this.currentUserSubject.asObservable();

    this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.options = { 'headers': this.headers };
  }

  isLoggedIn(): Observable<boolean> {
    this.loggedIn.next(this.jwtHelper.tokenGetter() && !this.jwtHelper.isTokenExpired());
    return this.loggedIn.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login = async (emailOrUsername: string, password: string): Promise<User> => {
    try {
      const authenticationInfo: any = await this.http.post<User>(
        this.loginUrl,
        { username: emailOrUsername, password },
        { headers: this.headers }
      ).toPromise();
      const user = await this.http.get<User>(`${this.apiUrl}${authenticationInfo._links.authenticatedUser.href}`)
        .toPromise();
      if (user) {
        user.token = authenticationInfo.token;
        localStorage.setItem('current_user', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  logout() {
    localStorage.removeItem('current_user');
  }

}
