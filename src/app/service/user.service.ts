import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { User } from '../content/users/user';
import { Ticket } from '../content/tickets/ticket';
import { Observable, forkJoin, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { Apollo, gql } from 'apollo-angular';
import { BaseService } from '../content/base/base.service';

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
    return this.apollo.query({
      query: gql`
        query GetUser($id: Int!) {
          user(id: $id) {
            id
            email
            username
            firstName
            lastName
            assignedTickets {
              id
              ticket {
                id
                name
                description
              }
            }
          }
        }
      `,
      variables: {
        id: userId
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['user'] as User;
    }));
  };

  getUsers = (take: number = 10) => {
    return this.apollo.query({
      query: gql`
        query GetUsers {
          users(take: ${take}) {
            id
            email
            username
            firstName
            lastName
            assignments {
              id
              ticket {
                id
                name
                description
              }
            }
          }
        }
      `
    }).pipe(map(fetchResult => {
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
          firstName: user.firstName,
          lastName: user.username,
          password: user.password
        }],
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['addUser']
      .map((user: User) => new User({...user})) as User[];
    }),catchError(this.handleError<any>()));
  }

  update(user: User) {
    const updateUsersUrl = `${this.apiUrl}${user._links.self.href}`;
    return this.http
      .put<User>(updateUsersUrl, JSON.stringify(user), this.options)
      .pipe(map(user => new User(user)));
  }

  delete(user: User) {
    return this.apollo.mutate({
      mutation: gql`
        mutation RemoveUser($userIds: [Int!]!) {
          removeUser(userIds: $userIds) {
            id
          }
        }
      `,
      variables: {
        userIds: [user.id]
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['removeUser'] as User;
    }),catchError(this.handleError<any>()));
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
    // TODO: Getting all errors, network level, graphql level, whatever...
  }

  getAssignments = (user: User) => {
    const getAssignedTicketsUrl = `${this.apiUrl}${user._links.assignedTickets.href}`;

    return this.http.get<any>(getAssignedTicketsUrl)
      .pipe(
        map((ticketsData) => ticketsData._embedded.tickets as Ticket[]),
        mergeMap((tickets) => {
          return forkJoin(tickets.map((ticket) => this.http.get<Ticket>(`${this.apiUrl}/${ticket._links.self.href}`)))
        })
      );
  }

  updateAssignments = (user: User, toAssignTicketIds: number[], toUnassignTicketIds: number[]) => {
    const assignedTicketsUrl = `${this.apiUrl}${user._links.assignedTickets.href}`;
    const additionsAndRemovals = JSON.stringify({
      added: toAssignTicketIds,
      removed: toUnassignTicketIds
    });
    return this.http.put<Ticket[]>(assignedTicketsUrl, additionsAndRemovals, this.options)
      .pipe<Ticket[]>(
        catchError(this.handleError<Ticket[]>())
      );
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
