import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { Ticket } from '../content/tickets/ticket';
import { TicketCategory } from '../content/tickets/ticket-category';
import { TicketStatus } from '../content/tickets/status';

import { BaseService } from '../content/base/base.service';
import { QueryFragments } from './query-fragments';

// TODO: https://www.apollographql.com/docs/angular/recipes/pagination/
@Injectable()
export class TicketService extends BaseService<Ticket> {
  protected className = { singular: Ticket.name, plural: `${Ticket.name}s` };
  protected getResourceQuery = {
    query: gql`
      query GetTicket($id: Int!) {
        ticket(id: $id) {
          ...ticket
        }
      }
      ${QueryFragments.TICKET}
    `,
    variables: { take: 10 }
  };

  protected getResourcesQuery = {
    query: gql`
      query GetTickets($take: Int) {
        tickets(take: $take) {
          ...ticket
        }
      }
      ${QueryFragments.TICKET}
    `,
  };

  constructor(
    private apollo: Apollo,
  ) {
    super();
  }

  getTicket = (ticketId: number) => {
    return this.apollo.watchQuery({
      query: this.getResourceQuery.query,
      variables: {
        id: ticketId
      },
    }).valueChanges.pipe(map(fetchResult => {
      return fetchResult.data['ticket'] as Ticket;
    }));
  };

  getTickets = (take: number = 10) => {
    const query = { query: this.getResourcesQuery.query, variables: { take } };
    return this.apollo.watchQuery<{ tickets: Ticket[] }>(query)
      .valueChanges.pipe(map(fetchResult => {
        return fetchResult.data.tickets;
    }));
  };

  getTicketsNoRels = (take: number = 10) => {
    const query = { query: gql`
      query GetTickets($take: Int) {
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
            tags: ticket.tags?.map(tag => ({ id: tag.id, ticketId: tag.ticketId, categoryId: tag.categoryId })) || undefined,
          },
        ]
      },
      update: this.updateCache,
    }).pipe(map(fetchResult => {
      return fetchResult.data['updateTicket'];
    }),catchError(this.handleError<any>()));
  };

  delete = (ticket: Ticket) => {
    return this.apollo.mutate({
      mutation: gql`
        mutation RemoveTicket($ticketIds: [Int!]!) {
          removeTicket(ticketIds: $ticketIds)
        }
      `,
      variables: {
        ticketIds: [ticket.id]
      },
      update: (cacheStore) => this.updateCache(cacheStore, { data: { removeTicket: [ticket] } }),
    });
  };

  getTicketCategories(take: number = 10) {
    return this.apollo.watchQuery({
      query: gql`
        query GetTicketCategories {
          ticketCategories(take: ${take}) {
            id
            name
          }
        }
      `,
    }).valueChanges.pipe(map(fetchResult => {
      return fetchResult.data['ticketCategories'] as TicketCategory[];
    }));
  };

  createTicketCategory(ticketCategory: TicketCategory) {
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

  updateTicketCategory(ticketCategory: TicketCategory) {
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

  deleteTicketCategory(ticketCategory: TicketCategory) {
    return this.apollo.mutate({
      mutation: gql`
        mutation RemoveTicketCategory($ticketCategoryIds: [Int!]!) {
          removeTicketCategory(ticketCategoryIds: $ticketCategoryIds) {
            name
          }
        }
      `,
      variables: {
        ticketCategoryIds: [ticketCategory.id]
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['removeTicketCategory']
        .map(tc => new TicketCategory({...tc})) as TicketCategory[];
    }));
  }

  getTicketStatuses = (take: number = 10): Observable<TicketStatus[]> => {
    return this.apollo.watchQuery({
      query: gql`
        query TicketStatuses {
          ticketStatuses(take: ${take}) {
            id
            name
          }
        }
      `,
    }).valueChanges.pipe(map(fetchResult => {
      return fetchResult.data['ticketStatuses'] as TicketStatus[];
    }));
  };

  createTicketStatus(ticketStatus: TicketStatus) {
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

  updateTicketStatus(ticketStatus: TicketStatus) {
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

  deleteTicketStatus(ticketStatus: TicketStatus) {
    return this.apollo.mutate({
      mutation: gql`
        mutation RemoveTicketStatus($ticketStatusIds: [Int!]!) {
          removeTicketStatus(ticketStatusIds: $ticketStatusIds) {
            name
          }
        }
      `,
      variables: {
        ticketStatusIds: [ticketStatus.id]
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['removeTicketStatus'] as TicketStatus;
    }));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError = <T>(result?: T) => {
    return (error: any): Observable<T> => {
      console.error(error);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
