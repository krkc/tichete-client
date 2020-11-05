import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { Ticket } from '../content/tickets/ticket';
import { TicketCategory } from '../content/tickets/category';
import { User } from '../content/users/user';
import { TicketStatus } from '../content/tickets/status';
import { catchError, mergeMap, map } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

import { QueryFragments } from './query-fragments';
import { AuthenticationService } from './authentication.service';
import { BaseService } from '../content/base/base.service';

@Injectable()
export class TicketService extends BaseService {
  private apiUrl = 'api';
  private ticketsUrl = `${this.apiUrl}/tickets`;
  private ticketCategoriesUrl = `${this.ticketsUrl}/categories`;
  private ticketStatusesUrl = `${this.ticketsUrl}/statuses`;
  private headers: HttpHeaders;
  private options;

  constructor(
    private apollo: Apollo,
    private authService: AuthenticationService,
    private http: HttpClient,
  ) {
    super();
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json', });
    this.options = { headers: this.headers };
  }

  getTicket = (ticketId: number) => {
    return this.apollo.query({
      query: gql`
        query GetTicket($id: Int!) {
          ticket(id: $id) {
            ...ticket
          }
        }
        ${QueryFragments.TICKET}
      `,
      variables: {
        id: ticketId
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['ticket'] as Ticket;
    }));
  };

  getTickets = (take: number = 10) => {
    return this.apollo.query({
      query: gql`
        query GetTickets {
          tickets(take: ${take}) {
            ...ticket
          }
        }
        ${QueryFragments.TICKET}
      `
    }).pipe(map(fetchResult => {
      return fetchResult.data['tickets']
        .map((ticket: Ticket) => new Ticket({...ticket})) as Ticket[];
    }));
  };
  // TODO: Just got ticket update working.
  // Still need to figure out how to update the tagged categories
  update = (ticket: Ticket) => {
    return this.apollo.mutate({
      mutation: gql`
        mutation UpdateTicket($updateTicketData: UpdateTicketInput!) {
          updateTicket(updateTicketData: $updateTicketData) {
            id
            name
            description
            tags {
              id
              ticketId
              categoryId
            }
          }
        }
      `,
      variables: {
        updateTicketData: {
          id: ticket.id,
          creatorId: ticket.creatorId,
          statusId: ticket.statusId,
          description: ticket.description,
          taggedCategories: ticket.tags.map(c => ({ ticketId: ticket.id, categoryId: c.id }))
        },
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['updateTicket'] as Ticket;
    }),catchError(this.handleError<any>('updateTicket')));
  };

  create = (description: string, ticketCategoryIds: number[]) => {
    return this.apollo.mutate({
      mutation: gql`
        mutation AddTicket($newTicketData: [NewTicketInput!]!) {
          addTicket(newTicketData: $newTicketData) {
            id
            name
            description
          }
        }
      `,
      variables: {
        newTicketData: [{
          description,
          creatorId: this.authService.currentUserValue.id,
          taggedCategories: ticketCategoryIds.map(id => new TicketCategory({id}))
        }],
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['addTicket']
      .map((ticket: Ticket) => new Ticket({...ticket})) as Ticket[];
    }),catchError(this.handleError<any>('createTicket')));
  };

  delete = (ticket: Ticket) => {
    return this.apollo.mutate({
      mutation: gql`
        mutation RemoveTicket($ticketIds: [Int!]!) {
          removeTicket(ticketIds: $ticketIds) {
            id
          }
        }
      `,
      variables: {
        ticketIds: [ticket.id]
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['removeTicket'] as Ticket;
    }),catchError(this.handleError<any>('deleteTicket')));
  };

  getTicketCategories(take: number = 10) {
    return this.apollo.query({
      query: gql`
        query GetTicketCategories {
          ticketCategories(take: ${take}) {
            id
            name
          }
        }
      `
    }).pipe(map(fetchResult => {
      return fetchResult.data['ticketCategories'] as TicketCategory[];
    }));
  };

  createTicketCategory(ticketCategory: TicketCategory) {
    return this.apollo.mutate({
      mutation: gql`
        mutation AddTicketCategory($newTicketCategoryData: NewCategoryInput!) {
          addTicketCategory(newTicketCategoryData: $newTicketCategoryData) {
            id
            name
          }
        }
      `,
      variables: {
        newTicketCategoryData: {
          name: ticketCategory.name
        },
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['addTicketCategory'] as TicketCategory;
    }));
  }

  updateTicketCategory(ticketCategory: TicketCategory) {
    const ticketCategoryUpdateUrl = `${this.ticketCategoriesUrl}/${ticketCategory.id}`;
    return this.http.patch<TicketCategory>(ticketCategoryUpdateUrl, ticketCategory);
  }

  deleteTicketCategory(ticketCategory: TicketCategory) {
    const ticketCategoryDeleteUrl = `${this.ticketCategoriesUrl}/${ticketCategory.id}`;
    return this.http.delete(ticketCategoryDeleteUrl);
  }

  getTicketStatuses = (take: number = 10): Observable<TicketStatus[]> => {
    return this.apollo.query({
      query: gql`
        query TicketStatuses {
          ticketStatuses(take: ${take}) {
            id
            name
          }
        }
      `
    }).pipe(map(fetchResult => {
      return fetchResult.data['ticketStatuses'] as TicketStatus[];
    }));
  };

  createTicketStatus(ticketStatus: TicketStatus) {
    return this.apollo.mutate({
      mutation: gql`
        mutation AddTicketStatus($newTicketStatusData: NewTicketStatusInput!) {
          addTicketStatus(newTicketStatusData: $newTicketStatusData) {
            id
            name
          }
        }
      `,
      variables: {
        newTicketStatusData: {
          name: ticketStatus.name
        },
      },
    }).pipe(map(fetchResult => {
      return fetchResult.data['assignTicketsToUser'] as TicketStatus;
    }));
  }

  updateTicketStatus(ticketStatus: TicketStatus) {
    const ticketStatusUpdateUrl = `${this.ticketStatusesUrl}/${ticketStatus.id}`;
    return this.http.patch<TicketStatus>(ticketStatusUpdateUrl, ticketStatus);
  }

  deleteTicketStatus(ticketStatus: TicketStatus) {
    const ticketStatusDeleteUrl = `${this.ticketStatusesUrl}/${ticketStatus.id}`;
    return this.http.delete(ticketStatusDeleteUrl);
  }

  getTaggedCategories = (ticket: Ticket) => {
    const getTaggedCategoriesUrl = `${this.apiUrl}${ticket._links.taggedCategories.href}`;
    return this.http.get<TicketCategory[]>(getTaggedCategoriesUrl);
  };

  getAssignedUsers = (ticket: Ticket) => {
    const getAssignedUsersUrl = `${this.apiUrl}${ticket._links.assignedUsers.href}`;
    return this.http.get<any>(getAssignedUsersUrl)
      .pipe(
        map((usersData) => usersData._embedded.users as User[]),
        mergeMap((users) => {
          return forkJoin(users.map((userData) => {
            return this.http.get<User>(`${this.apiUrl}/${userData._links.self.href}`)
              .pipe(map(user => new User(user)))
          }))
        })
      );
  };

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
