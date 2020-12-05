import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";

import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { User } from '../models/user';

@Injectable()
export class AuthenticationService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private apollo: Apollo,
    public jwtHelper: JwtHelperService
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('current_user')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  isLoggedIn(): Observable<boolean> {
    this.loggedIn.next(this.jwtHelper.tokenGetter() && !this.jwtHelper.isTokenExpired());
    return this.loggedIn.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login = async (emailOrUsername: string, password: string): Promise<User> => {
    const fetchResult = await this.apollo.mutate({
      mutation: gql`
        mutation Login($email: String!, $password: String!) {
          login(email: $email,password: $password) {
            id
            firstName
            lastName
            email
            accessToken
          }
        }
      `,
      variables: {
        email: emailOrUsername,
        password
      },
    }).toPromise();

    const user: User = fetchResult.data['login'] as User;

    if (!user) {
      throw new Error(fetchResult.errors.toString());
    }

    localStorage.setItem('current_user', JSON.stringify(user));
    this.currentUserSubject.next(user);
    return user;
  }

  logout() {
    localStorage.removeItem('current_user');
  }
}
