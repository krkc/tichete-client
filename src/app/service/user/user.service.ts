import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthenticationService } from '../authentication.service';
import { Apollo, gql } from 'apollo-angular';

import { QueryFragments } from '../query-fragments';
import { BaseService, BaseServiceConfig } from '../base.service';
import { Ticket } from '../../models/ticket';
import { User } from '../../models/user';
import { RoleService } from './role.service';

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
  },
  deleteResourceQuery: {
    mutation: gql`
      mutation RemoveUser($ids: [Int!]!) {
        removeUser(ids: $ids)
      }
    `,
  },
};

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    apollo: Apollo,
    private authService: AuthenticationService,
    private roleService: RoleService,
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
          roleId: user.role?.id, // TODO: Right now roleId gets nulled (by serverside defaultValue) if a valid number isn't passed.
          //  That doesn't seem right, but graphql doesn't support 'undefined' type in JS. Ideally there should
          //  be a difference between passing roleId: null, and roleId: undefined (or not passing roleId at all).
          //  Seems undesireable that if someone unknowingly leaves off roleId in their mutation that it wipes the roleId. more research needed here.
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
                    description
                  }
                }
              }
            }
            assignments {
              ticket {
                id
                description
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

  // Helpers
  getRoles = this.roleService.getMany;
  createRole = this.roleService.create;
  updateRole = this.roleService.update;
  deleteRole = this.roleService.delete;
}
