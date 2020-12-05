import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { TicketStatus } from 'src/app/models/status';
import { BaseServiceConfig, BaseService } from 'src/app/service/base.service';
import { QueryFragments } from '../query-fragments';

const config: BaseServiceConfig = {
  className: { singular: TicketStatus.name, plural: `${TicketStatus.name}es` },
  getResourceQuery: {
    query: gql`
      query GetTicketStatus($id: Int!) {
        ticketStatus(id: $id) {
          id
          name
        }
      }
      ${QueryFragments.TICKET}
    `,
  },
  getResourcesQuery: {
    query: gql`
      query GetTicketStatuses($take: Int) {
        ticketStatuses(take: $take) {
          id
          name
        }
      }
    `,
  },
  deleteResourceQuery: {
    mutation: gql`
      mutation RemoveTicketStatus($ids: [Int!]!) {
        removeTicketStatus(ids: $ids)
      }
    `,
  },
};

@Injectable()
export class TicketStatusService extends BaseService<TicketStatus> {
  constructor(
    apollo: Apollo,
  ) {
    super(apollo, config);
  }

  create(ticketStatus: TicketStatus) {
    return this.apollo.mutate({
      mutation: gql`
        mutation AddTicketStatus($newTicketStatusData: [NewTicketStatusInput!]!) {
          addTicketStatus(newTicketStatusData: $newTicketStatusData) {
            id
            name
          }
        }
      `,
      variables: {
        newTicketStatusData: [{
          name: ticketStatus.name
        }],
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['assignTicketsToUser'] as TicketStatus[];
    }));
  }

  update(ticketStatus: TicketStatus) {
    return this.apollo.mutate({
      mutation: gql`
        mutation UpdateTicketStatus($updateTicketStatusData: [UpdateTicketStatusInput!]!) {
          updateTicketStatus(updateTicketStatusData: $updateTicketStatusData) {
            id
            name
          }
        }
      `,
      variables: {
        updateTicketStatusData: [{
          id: ticketStatus.id,
          name: ticketStatus.name
        }],
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['updateTicketStatus'] as TicketStatus[];
    }));
  }
}
