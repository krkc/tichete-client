import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Apollo, gql } from 'apollo-angular';

import { BaseService, BaseServiceConfig } from './base.service';
import { Ticket } from '../models/ticket';
import { User } from '../models/user';
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

  create = (user: User, ticket: Ticket) => {
    return this.apollo.mutate({
      mutation: gql`
        mutation AddAssignment($newAssignmentData: [NewAssignmentInput!]!) {
          addAssignment(newAssignmentData: $newAssignmentData) {
            id
            userId
            ticketId
          }
        }
      `,
      variables: {
        newAssignmentData: [
          {
            userId: user.id,
            ticketId: ticket.id
          }
        ],
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['addAssignment']
        .map((assignment: Assignment) => new Assignment({...assignment})) as Assignment[];
    }));
  };

}
