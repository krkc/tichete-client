import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, map } from 'rxjs/operators';
import { Permission } from 'src/app/models/permission';
import { BaseServiceConfig, BaseService } from 'src/app/service/base.service';
import { QUERY_FRAGMENTS } from '../query-fragments';

const config: BaseServiceConfig = {
  className: { singular: Permission.name, plural: `${Permission.name}s` },
  getResourceQuery: {
    query: gql`
      query GetPermission($id: Int!) {
        permission(id: $id) {
          ...permission
        }
      }
      ${QUERY_FRAGMENTS.permission}
    `,
  },
  getResourcesQuery: {
    query: gql`
      query GetPermission($take: Int) {
        permission(take: $take) {
          ...permission
        }
      }
      ${QUERY_FRAGMENTS.permission}
    `,
  },
  deleteResourceQuery: {
    mutation: gql`
      mutation RemovePermission($ids: [Int!]!) {
        removePermission(ids: $ids)
      }
    `,
  },
};

@Injectable()
export class PermissionService extends BaseService<Permission> {
  constructor(
    apollo: Apollo,
  ) {
    super(apollo, config);
  }

  create(permission: Permission) {
    return this.apollo.mutate<any>({
      mutation: gql`
        mutation AddPermission($newPermissionData: [NewPermissionInput!]!) {
          addPermission(newPermissionData: $newPermissionData) {
            id
            resourceName
          }
        }
      `,
      variables: {
        newPermissionData: [{
          resourceName: permission.resourceName,
          creatorOnly: !!permission.creatorOnly,
          canCreate: !!permission.canCreate,
          canRead: !!permission.canRead,
          canUpdate: !!permission.canUpdate,
          canDelete: !!permission.canDelete,
          roleId: permission.roleId || permission.role.id,
        }],
      },
    }).pipe(map(fetchResult => fetchResult.data.addPermission as Permission[]),catchError(this.handleError<any>()));
  }
// TODO: cache updating for create/update
  update(permission: Permission) {
    return this.apollo.mutate<any>({
      mutation: gql`
        mutation UpdatePermission($updatePermissionData: [UpdatePermissionInput!]!) {
          updatePermission(updatePermissionData: $updatePermissionData) {
            id
            resourceName
          }
        }
      `,
      variables: {
        updatePermissionData: [{
          id: permission.id,
          resourceName: permission.resourceName,
          creatorOnly: !!permission.creatorOnly,
          canCreate: !!permission.canCreate,
          canRead: !!permission.canRead,
          canUpdate: !!permission.canUpdate,
          canDelete: !!permission.canDelete,
          roleId: permission.roleId || permission.role.id,
        }],
      },
    }).pipe(map(fetchResult => fetchResult.data.updatePermission as Permission[]),catchError(this.handleError<any>()));
  }
}
