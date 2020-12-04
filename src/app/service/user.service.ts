import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { Apollo, gql } from 'apollo-angular';

import { QueryFragments } from './query-fragments';
import { BaseService, BaseServiceConfig } from '../content/base/base.service';
import { User } from '../content/users/user';
import { Ticket } from '../content/tickets/ticket';

const config: BaseServiceConfig = {
  className: { singular: User.name, plural: `${User.name}s` },
  getResourceQuery: {
    query: gql`
      query GetUser($id: Int!) {
        user(id: $id) {
          ...user
        }
      }
      ${QueryFragments.USER}
    `,
  },
  getResourcesQuery: {
    query: gql`
      query GetUsers($take: Int) {
        users(take: $take) {
          ...user
        }
      }
      ${QueryFragments.USER}
    `,
  }
};

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    apollo: Apollo,
    private authService: AuthenticationService,
  ) {
    super(apollo, config);
  }

  getManyNoRels = (take: number = 10) => {
    const query = { query: gql`
      query GetUsers($take: Int) {
        users(take: $take) {
          ...userMin
        }
      }
      ${QueryFragments.USERMIN}
      `,
      variables: { take }
    };
    return this.apollo.watchQuery<{ users: User[] }>(query)
      .valueChanges.pipe(map(fetchResult => fetchResult.data.users));
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
      update: this.updateCache,
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
            ...user
          }
        }
        ${QueryFragments.USER}
      `,
      variables: {
        updateUserData: [{
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.password,
          subscriptions: user.subscriptions?.map(sub => ({ id: sub.id, userId: user.id, categoryId: sub.categoryId || sub.category.id })) || undefined,
          assignments: user.assignments?.map(a => ({ id: a.id, userId: user.id, ticketId: a.ticketId || a.ticket.id })) || undefined,
        }],
      },
      update: this.updateCache,
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
      update: (cacheStore, fetchResult) => this.updateCache(cacheStore, { data: { removeUser: [user] } }),
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
              category {
                tags {
                  ticket {
                    id
                    name
                  }
                }
              }
            }
            assignments {
              ticket {
                id
                name
              }
            }
          }
        }
      `,
      variables: {
        id: this.authService.currentUserValue.id
      }
    }).pipe(map(fetchResult => {
      const user: User = fetchResult.data['user'];
      const tickets : Ticket[] = user.subscriptions?.reduce((acc, subscription) => {
        acc.push(...subscription.category.tags.map(tag => tag.ticket));
        return acc;
      }, [] as Ticket[]);
      tickets.push(...user.assignments.map(a => a.ticket));
      return tickets;
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
