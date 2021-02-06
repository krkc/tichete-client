import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { of } from 'rxjs';
import { BaseService, BaseServiceConfig } from './base.service';
import { Assignment } from '../models/assignment';

const config: BaseServiceConfig = {
  className: { singular: Assignment.name, plural: `${Assignment.name}s` },
  getResourceQuery: {
    query: gql`
      query GetAssignment($id: Int!) {
        assignment(id: $id) {
          id
          userId
          ticketId
        }
      }
    `,
    variables: { take: 10 }
  },
  getResourcesQuery: {
    query: gql`
      query GetAssignments($take: Int) {
        assignments(take: $take) {
          id
          userId
          ticketId
        }
      }
    `,
  },
  deleteResourceQuery: {
    mutation: gql`
      mutation RemoveAssignment($ids: [Int!]!) {
        removeAssignment(ids: $ids)
      }
    `,
  },
};

@Injectable()
export class AssignmentService extends BaseService<Assignment> {
  constructor(
    apollo: Apollo,
  ) {
    super(apollo, config);
  }

  create(assignment: Assignment) {return of([assignment]);}
  update(assignment: Assignment) {return of([assignment]);}
}
