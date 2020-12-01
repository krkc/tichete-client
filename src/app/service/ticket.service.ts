import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { Ticket } from '../content/tickets/ticket';
import { TicketCategory } from '../content/tickets/ticket-category';
import { TicketStatus } from '../content/tickets/status';
import { Tag } from '../content/tickets/tag';
import { User } from '../content/users/user';
import { Assignment } from '../content/assignment';

import { BaseService } from '../content/base/base.service';
import { QueryFragments } from './query-fragments';
import { ApolloCache, FetchResult } from '@apollo/client/core';

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
  }

  protected getResourcesQuery = {
    query: gql`
      query GetTickets($take: Int) {
        tickets(take: $take) {
          ...ticket
        }
      }
      ${QueryFragments.TICKET}
    `,
  }

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
        return fetchResult.data.tickets.map(this.mapTickets);
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
        return fetchResult.data.tickets.map(this.mapTickets);
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
    }).pipe(map(fetchResult => {
      return fetchResult.data['addTicket'].map(this.mapTickets);
    }),catchError(this.handleError<any>()));
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
      return fetchResult.data['updateTicket'].map(this.mapTickets);
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

  // protected updateCache = (cacheStore: ApolloCache<any>, { data }: FetchResult<any>) => {
  //   let tickets: Ticket[] = [];
  //   try {
  //     const prevData = cacheStore.readQuery({
  //       query: this.getResourceQuery.query,
  //       variables: this.getResourceQuery.variables,
  //     });
  //     tickets.push(...prevData['tickets']);
  //   } catch (error) {
  //     if (error.message !== 'Can\'t find field \'tickets\' on ROOT_QUERY object') {
  //       throw error;
  //     }
  //   }

  //   const mutationAction = Object.keys(data)[0];
  //   data[mutationAction].forEach(fetchedTicket => {
  //     if (mutationAction === 'removeTicket') {
  //       tickets.splice(tickets.findIndex(t => t.id === fetchedTicket.id),1);
  //     } else if (mutationAction === 'addTicket') {
  //       tickets.push(fetchedTicket);
  //     } else if (mutationAction === 'updateTicket') {
  //       tickets = tickets.map(t => t.id === fetchedTicket.id ? fetchedTicket: t);
  //     }
  //   });

  //   cacheStore.writeQuery({
  //     ...this.getResourceQuery,
  //     data: { tickets }
  //   });
  // }

  private mapTickets = (ticketData: Ticket): Ticket => {
    const ticket = new Ticket({...ticketData});
    ticket.assignments = ticketData.assignments?.map(a => new Assignment({...a})) || [];
    ticket.assignments.forEach(a => {
      a.user = new User({...a.user});
    });
    ticket.tags = ticketData.tags?.map(tag => new Tag({...tag})) || [];

    return ticket;
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
