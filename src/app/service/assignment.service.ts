import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { Assignment } from '../content/assignment';
import { User } from '../content/users/user';
import { Ticket } from '../content/tickets/ticket';
import { Apollo, gql } from 'apollo-angular';
import { BaseService } from '../content/base/base.service';

@Injectable()
export class AssignmentService extends BaseService {

  constructor(
    private apollo: Apollo,
  ) {
    super();
  }

  getAssignments = (take: number = 10) => {
    return this.apollo.query({
      query: gql`
        query GetAssignments {
          assignments(take: ${take}) {
            id
            userId
            ticketId
          }
        }
      `
    }).pipe(map(fetchResult => {
      return fetchResult.data['assignments']
        .map((assignment: Assignment) => new Assignment({...assignment})) as Assignment[];
    }));
  };

  create = (user: User, ticket: Ticket) => {
    return this.apollo.mutate({
      mutation: gql`
        mutation AddAssignment($newAssignmentData: [NewAssignmentInput!]!) {
          addAssignment(newAssignmentData: $newAssignmentData) {
            id
            firstName
            lastName
            email
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

  delete = (assignment: Assignment) => {
    return this.apollo.mutate({
      mutation: gql`
        mutation RemoveAssignment($assignmentIds: [Int!]!) {
          removeAssignment(assignmentIds: $assignmentIds) {
            id
            firstName
            lastName
            email
          }
        }
      `,
      variables: {
        assignmentIds: [assignment.id],
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['removeAssignment']
        .map((assignment: Assignment) => new Assignment({...assignment})) as Assignment[];
    }));
  };

  assignTicketsToUser = (user: User, ticket: Ticket) => {
    return this.apollo.mutate({
      mutation: gql`
        mutation AssignTicketsToUser($userId: Int!, $assignedTicketIds: [Int!]!) {
          assignTicketsToUser(userId: $userId,assignedTicketIds: $assignedTicketIds) {
            id
            firstName
            lastName
            email
          }
        }
      `,
      variables: {
        userId: user.id,
        assignedTicketIds: [ticket.id]
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['assignTicketsToUser'] as User;
    }));
  };

  unassignTicketsFromUser = (assignment: Assignment) => {
    return this.apollo.mutate({
      mutation: gql`
        mutation UnassignTicketsFromUser($assignmentIds: [Int!]!) {
          unassignTicketsFromUser(assignmentIds: $assignmentIds) {
            id
            firstName
            lastName
            email
          }
        }
      `,
      variables: {
        assignmentIds: [assignment.id],
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['assignTicketsToUser'] as User;
    }));
  };

}
