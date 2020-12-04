import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, map } from 'rxjs/operators';
import { Ticket } from '../../content/tickets/ticket';
import { BaseService, BaseServiceConfig } from '../../content/base/base.service';
import { QueryFragments } from '../query-fragments';
import { TicketCategoryService } from './ticket-category.service';
import { TicketStatusService } from './ticket-status.service';

const config: BaseServiceConfig = {
  className: { singular: Ticket.name, plural: `${Ticket.name}s` },
  getResourceQuery: {
    query: gql`
      query GetTicket($id: Int!) {
        ticket(id: $id) {
          ...ticket
        }
      }
      ${QueryFragments.TICKET}
    `,
  },
  getResourcesQuery: {
    query: gql`
      query GetTickets($take: Int) {
        tickets(take: $take) {
          ...ticket
        }
      }
      ${QueryFragments.TICKET}
    `,
  },
  deleteResourceQuery: {
    mutation: gql`
      mutation RemoveTicket($ids: [Int!]!) {
        removeTicket(ids: $ids)
      }
    `,
  },
};

// TODO: https://www.apollographql.com/docs/angular/recipes/pagination/
@Injectable()
export class TicketService extends BaseService<Ticket> {
  constructor(
    apollo: Apollo,
    private ticketCategoryService: TicketCategoryService,
    private ticketStatusService: TicketStatusService,
  ) {
    super(apollo, config);
  }

  getManyNoRels = (take: number = 10) => {
    const query = { query: gql`
      query GetTicketsMin($take: Int) {
        tickets(take: $take) {
          ...ticketMin
        }
      }
      ${QueryFragments.TICKETMIN}
      `, variables: { take }
    };
    return this.apollo.watchQuery<{ tickets: Ticket[] }>(query)
      .valueChanges.pipe(map(fetchResult => {
        return fetchResult.data.tickets;
    }));
  };

  create = (ticket: Ticket) => {
    return this.apollo.mutate({
      mutation: gql`
        mutation AddTicket($newTicketData: [NewTicketInput!]!) {
          addTicket(newTicketData: $newTicketData) {
            ...ticket
          }
        }
        ${QueryFragments.TICKET}
      `,
      variables: {
        newTicketData: [{
          description: ticket.description,
          creatorId: ticket.creatorId,
          ticketCategoryIds: ticket.tags?.map(tag => tag.categoryId) || []
        }],
      },
      update: this.updateCache,
    }).pipe(map(fetchResult => fetchResult.data['addTicket']),
      catchError(this.handleError<any>())
    );
  };

  update = (ticket: Ticket) => {
    return this.apollo.mutate({
      mutation: gql`
        mutation UpdateTicket($updateTicketData: [UpdateTicketInput!]!) {
          updateTicket(updateTicketData: $updateTicketData) {
            ...ticket
          }
        }
        ${QueryFragments.TICKET}
      `,
      variables: {
        updateTicketData: [
          {
            id: ticket.id,
            creatorId: ticket.creatorId,
            statusId: ticket.statusId,
            description: ticket.description,
            tags: ticket.tags?.map(tag => ({ id: tag.id, ticketId: ticket.id, categoryId: tag.categoryId || tag.category.id })) || undefined,
            assignments: ticket.assignments?.map(a => ({ id: a.id, ticketId: ticket.id, userId: a.userId || a.user.id })) || undefined,
          },
        ]
      },
      update: this.updateCache,
    }).pipe(map(fetchResult => {
      return fetchResult.data['updateTicket'];
    }),catchError(this.handleError<any>()));
  };

  // Helpers
  getTicketCategories = this.ticketCategoryService.getMany;
  createTicketCategory = this.ticketCategoryService.create;
  updateTicketCategory = this.ticketCategoryService.update;
  deleteTicketCategory = this.ticketCategoryService.delete;

  getTicketStatuses = this.ticketStatusService.getMany;
  createTicketStatus = this.ticketStatusService.create;
  updateTicketStatus = this.ticketStatusService.update;
  deleteTicketStatus = this.ticketStatusService.delete;
}
