import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthenticationService } from '../authentication.service';
import { Apollo, gql } from 'apollo-angular';

import { QUERY_FRAGMENTS } from '../query-fragments';
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
      ${QUERY_FRAGMENTS.user}
    `,
  },
  getResourcesQuery: {
    query: gql`
      query GetUsers($take: Int) {
        users(take: $take) {
          ...user
        }
      }
      ${QUERY_FRAGMENTS.user}
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
  // Helpers
  getRoles = this.roleService.getMany;
  createRole = this.roleService.create;
  updateRole = this.roleService.update;
  deleteRole = this.roleService.delete;

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
      ${QUERY_FRAGMENTS.userMin}
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
    }).pipe(map(fetchResult => fetchResult.data.addUser
      .map((_user: User) => new User({..._user})) as User[]),catchError(this.handleError<any>()));
  }

  update(user: User) {
    return this.apollo.mutate({
      mutation: gql`
        mutation UpdateUser($updateUserData: [UpdateUserInput!]!) {
          updateUser(updateUserData: $updateUserData) {
            ...user
          }
        }
        ${QUERY_FRAGMENTS.user}
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
          //  Seems undesireable that if someone unknowingly leaves off roleId in their mutation that it wipes the roleId.
          //  more research needed here.
          subscriptions: user.subscriptions?.map(sub =>
            ({ id: sub.id, userId: user.id, categoryId: sub.categoryId || sub.category.id })) || undefined,
          assignments: user.assignments?.map(a => ({ id: a.id, userId: user.id, ticketId: a.ticketId || a.ticket.id })) || undefined,
        }],
      },
      update: this.updateCache,
    }).pipe(map(fetchResult => fetchResult.data.updateUser
      .map((_user: User) => new User({..._user})) as User[]),catchError(this.handleError<any>()));
  }

  getTicketFeed = (): Observable<Ticket[]> => this.apollo.query<any>({
      query: gql`
        query MyFeed($id: Int!) {
          user(id: $id) {
            id
            role { ...roleMin }
            subscriptions {
              id
              category {
                id
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
        ${QUERY_FRAGMENTS.roleMin}
      `,
      variables: {
        id: this.authService.currentUserValue.id
      }
    }).pipe(map(fetchResult => {
      const user: User = fetchResult.data.user;
      const tickets: Ticket[] = user.subscriptions?.reduce((acc, subscription) => {
        acc.push(...subscription.category.tags.map(tag => tag.ticket));
        return acc;
      }, [] as Ticket[]) || [];
      if (user.assignments) {
        tickets.push(...user.assignments.map(a => a.ticket));
      }
      return tickets;
    }));
}
