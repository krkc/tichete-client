import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { Apollo, gql } from 'apollo-angular';

import { QueryFragments } from './query-fragments';
import { BaseService } from '../content/base/base.service';
import { User } from '../content/users/user';
import { Ticket } from '../content/tickets/ticket';

@Injectable()
export class UserService extends BaseService {
  private apiUrl: string = '/api';
  private headers: HttpHeaders;
  private options: { headers: HttpHeaders };
  constructor(
    private apollo: Apollo,
    private http: HttpClient,
    private authService: AuthenticationService,
  ) {
    super();
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.options = { headers: this.headers };
  }

  getUser = (userId: number) => {
    return this.apollo.watchQuery({
      query: gql`
        query GetUser($id: Int!) {
          user(id: $id) {
            ...user
          }
        }
        ${QueryFragments.USER}
      `,
      variables: {
        id: userId
      },
      pollInterval: 500
    }).valueChanges.pipe(map(fetchResult => {
      return fetchResult.data['user'] as User;
    }));
  };

  getUsers = (take: number = 10) => {
    return this.apollo.watchQuery({
      query: gql`
        query GetUsers {
          users(take: ${take}) {
            ...user
          }
        }
        ${QueryFragments.USER}
      `,
      pollInterval: 500
    }).valueChanges.pipe(map(fetchResult => {
      return fetchResult.data['users']
        .map((user: User) => new User({...user})) as User[];
    }));
  };

  create(user: User) {
    return this.apollo.mutate({
      mutation: gql`
        mutation AddUser($newUserData: [NewUserInput!]!) {
          addUser(newUserData: $newUserData) {
            id
            email
            username
            firstName
            lastName
          }
        }
      `,
      variables: {
        newUserData: [{
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.password
        }],
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['addUser']
      .map((user: User) => new User({...user})) as User[];
    }),catchError(this.handleError<any>()));
  }

  update(user: User) {
    return this.apollo.mutate({
      mutation: gql`
        mutation UpdateUser($updateUserData: [UpdateUserInput!]!) {
          updateUser(updateUserData: $updateUserData) {
            id
            email
            username
            firstName
            lastName
          }
        }
      `,
      variables: {
        updateUserData: [{
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.password
        }],
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['updateUser']
      .map((user: User) => new User({...user})) as User[];
    }),catchError(this.handleError<any>()));
  }

  delete(user: User) {
    return this.apollo.mutate({
      mutation: gql`
        mutation RemoveUser($userIds: [Int!]!) {
          removeUser(userIds: $userIds)
        }
      `,
      variables: {
        userIds: [user.id]
      },
    });
  }

  getMyTickets = (): Observable<Ticket[]> => {
    return this.apollo.query({
      query: gql`
        query MyTickets($id: Int!) {
          user(id: $id) {
            id
            submittedTickets {
              id
              name
              description
              statusId
            }
          }
        }
      `,
      variables: {
        id: this.authService.currentUserValue.id,
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['user']['submittedTickets'] as Ticket[];
    }));
  };

  getTicketFeed = (): Observable<Ticket[]> => {
    return this.apollo.query({
      query: gql`
        query MyFeed($id: Int!) {
          user(id: $id) {
            id
            subscriptions {
              id
              userId
              categoryId
            }
          }
        }
      `,
      variables: {
        id: this.authService.currentUserValue.id
      }
    }).pipe(map(fetchResult => {
      return fetchResult.data['user']['subscriptions'] as Ticket[];
    }));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
