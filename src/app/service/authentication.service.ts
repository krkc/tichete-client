import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";

const helper = new JwtHelperService();

import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationService {
  private loginUrl = 'api/user/login';
  private authUrl = 'api/user/auth';
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient
  ) { }

  isLoggedIn(): Observable<boolean> {
    this.loggedIn.next(helper.tokenGetter() && helper.isTokenExpired('access_token').valueOf());
    return this.loggedIn.asObservable();
  }

  async login(_username: string, _passwd: string): Promise<any> {
    try {
      const response = await this.http.post(this.loginUrl, JSON.stringify({ username: _username, password: _passwd }), { headers: this.headers })
        .toPromise();
      if (response) {
        localStorage.setItem('access_token', response.toString());
        return 0;
      }
      else {
        return (-1);
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  logout() {
    localStorage.removeItem('access_token');
  }

}
