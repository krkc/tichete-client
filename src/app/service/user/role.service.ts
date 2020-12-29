import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Role } from 'src/app/models/role';
import { BaseServiceConfig, BaseService } from 'src/app/service/base.service';
import { QueryFragments } from '../query-fragments';

const config: BaseServiceConfig = {
  className: { singular: Role.name, plural: `${Role.name}s` },
  getResourceQuery: {
    query: gql`
      query GetRole($id: Int!) {
        role(id: $id) {
          ...role
        }
      }
      ${QueryFragments.ROLE}
    `,
  },
  getResourcesQuery: {
    query: gql`
      query GetRoles($take: Int) {
        roles(take: $take) {
          ...role
        }
      }
      ${QueryFragments.ROLE}
    `,
  },
  deleteResourceQuery: {
    mutation: gql`
      mutation RemoveRole($ids: [Int!]!) {
        removeRole(ids: $ids)
      }
    `,
  },
};

@Injectable()
export class RoleService extends BaseService<Role> {
  constructor(
    apollo: Apollo,
  ) {
    super(apollo, config);
  }

  create(role: Role) {
    return this.apollo.mutate({
      mutation: gql`
        mutation AddRole($newRoleData: [NewRoleInput!]!) {
          addRole(newRoleData: $newRoleData) {
            id
            name
          }
        }
      `,
      variables: {
        newRoleData: [{
          name: role.name
        }],
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['addRole'] as Role[];
    }));
  }

  update(role: Role) {
    return this.apollo.mutate({
      mutation: gql`
        mutation UpdateRole($updateRoleData: [UpdateRoleInput!]!) {
          updateRole(updateRoleData: $updateRoleData) {
            id
            name
          }
        }
      `,
      variables: {
        updateRoleData: [{
          id: role.id,
          name: role.name,
          permissions: role.permissions,
        }],
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['updateRole'] as Role[];
    }));
  }
}
