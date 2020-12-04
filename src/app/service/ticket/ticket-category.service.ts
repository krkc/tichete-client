import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { BaseServiceConfig, BaseService } from 'src/app/content/base/base.service';
import { TicketCategory } from 'src/app/content/tickets/ticket-category';
import { QueryFragments } from '../query-fragments';

const config: BaseServiceConfig = {
  className: { singular: TicketCategory.name, plural: `TicketCategories` },
  getResourceQuery: {
    query: gql`
      query GetTicketCategory($id: Int!) {
        ticketCategory(id: $id) {
          id
          name
        }
      }
      ${QueryFragments.TICKET}
    `,
  },
  getResourcesQuery: {
    query: gql`
      query GetTicketCategories($take: Int) {
        ticketCategories(take: $take) {
          id
          name
        }
      }
    `,
  },
  deleteResourceQuery: {
    mutation: gql`
      mutation RemoveTicketCategory($ids: [Int!]!) {
        removeTicketCategory(ids: $ids)
      }
    `,
  },
};

@Injectable()
export class TicketCategoryService extends BaseService<TicketCategory> {
  constructor(
    apollo: Apollo,
  ) {
    super(apollo, config);
  }

  create(ticketCategory: TicketCategory) {
    return this.apollo.mutate({
      mutation: gql`
        mutation AddTicketCategory($newTicketCategoryData: [NewCategoryInput!]!) {
          addTicketCategory(newTicketCategoryData: $newTicketCategoryData) {
            id
            name
          }
        }
      `,
      variables: {
        newTicketCategoryData: [{
          name: ticketCategory.name
        }],
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['addTicketCategory'] as TicketCategory[];
    }));
  }

  update(ticketCategory: TicketCategory) {
    return this.apollo.mutate({
      mutation: gql`
        mutation UpdateTicketCategory($updateTicketCategoryData: [UpdateCategoryInput!]!) {
          updateTicketCategory(updateTicketCategoryData: $updateTicketCategoryData) {
            id
            name
          }
        }
      `,
      variables: {
        updateTicketCategoryData: [{
          id: ticketCategory.id,
          name: ticketCategory.name
        }],
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['updateTicketCategory'] as TicketCategory[];
    }));
  }
}
