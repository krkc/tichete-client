import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { Ticket } from '../content/tickets/ticket';
import { TicketCategory } from '../content/tickets/category';
import { User } from '../content/users/user';
import { TicketStatus } from '../content/tickets/status';
import { catchError, mergeMap, map } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';

@Injectable()
export class TicketService {
  private apiUrl = 'api';
  private ticketsUrl = `${this.apiUrl}/tickets`;
  private ticketCategoriesUrl = `${this.ticketsUrl}/categories`;
  private ticketStatusesUrl = `${this.ticketsUrl}/statuses`;
  private headers: HttpHeaders;
  private options;

  constructor(
    private http: HttpClient,
  ) {
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json', });
    this.options = { headers: this.headers };
  }

  getTicket = (ticketId: number) => {
    const url = `${this.ticketsUrl}/${ticketId}`;
    return this.http.get<Ticket>(url);
  };

  getTickets = () => {
    return this.http.get<any>(this.ticketsUrl)
      .pipe(
        map((ticketsData) => ticketsData._embedded.tickets as Ticket[]),
        mergeMap((tickets) => {
          return forkJoin(tickets.map((ticket) => this.http.get<Ticket>(`${this.apiUrl}/${ticket._links.self.href}`)))
        })
      );
  };

  update = (ticket: Ticket) => {
    const url = `${this.ticketsUrl}/${ticket.id}`;    
    return this.http.patch<Ticket>(
      url,
      ticket,
      this.options);
  };

  create = (description: string, ticketCategoryIds: number[]) => {
    return this.http.post<Ticket>(
      this.ticketsUrl,
      JSON.stringify({
        description,
        ticketCategoryIds
      }),
      this.options).pipe<Ticket>(
        catchError(this.handleError<any>('createTicket'))
      );
  };

  delete = (ticket: Ticket) => {
    const deleteTicketUrl = `${this.apiUrl}${ticket._links.self.href}`;
    return this.http.delete(deleteTicketUrl);
  };

  getTicketCategories() {
    return this.http.get<any>(this.ticketCategoriesUrl)
      .pipe(
        map((ticketCategoriesData) => ticketCategoriesData._embedded.ticketCategorys as TicketCategory[]),
        mergeMap((ticketCategories) => {
          return forkJoin(ticketCategories.map((ticketCategory) => this.http.get<TicketCategory>(`${this.apiUrl}/${ticketCategory._links.self.href}`)));
        })
      );
  };

  createTicketCategory(ticketCategory: TicketCategory) {
    return this.http.post<TicketCategory>(this.ticketCategoriesUrl, ticketCategory);
  }

  updateTicketCategory(ticketCategory: TicketCategory) {
    const ticketCategoryUpdateUrl = `${this.ticketCategoriesUrl}/${ticketCategory.id}`;
    return this.http.patch<TicketCategory>(ticketCategoryUpdateUrl, ticketCategory);
  }

  deleteTicketCategory(ticketCategory: TicketCategory) {
    const ticketCategoryDeleteUrl = `${this.ticketCategoriesUrl}/${ticketCategory.id}`;
    return this.http.delete(ticketCategoryDeleteUrl);
  }

  getTicketStatuses = () => {
    return this.http.get<any>(this.ticketStatusesUrl)
      .pipe(
        map((statusesData) => statusesData._embedded.ticketStatus as TicketStatus[]),
        mergeMap((statuses) => {
          return forkJoin(statuses.map((status) => this.http.get<TicketStatus>(`${this.apiUrl}/${status._links.self.href}`)))
        })
      );
  };

  createTicketStatus(ticketStatus: TicketStatus) {
    return this.http.post<TicketStatus>(this.ticketStatusesUrl, ticketStatus);
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
