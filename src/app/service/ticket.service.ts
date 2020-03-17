import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { Ticket } from '../content/tickets/ticket';
import { TicketCategory } from '../content/tickets/category';
import { User } from '../content/users/user';
import { TicketStatus } from '../content/tickets/status';
import { catchError, mergeMap, map } from 'rxjs/operators';
import { Observable, of, OperatorFunction, forkJoin } from 'rxjs';

@Injectable()
export class TicketService {
  private apiUrl = 'api';
  private ticketsUrl = 'api/tickets';  // URL to tickets web api
  private categoriesUrl = 'api/tickets/categories'; // URL to api
  private statusesUrl = 'api/tickets/statuses'; // URL to api
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
  getCategories() {
    return this.http.get<TicketCategory[]>(this.categoriesUrl);
  };
  getStatuses = () => {
    return this.http.get<TicketStatus[]>(this.statusesUrl)
      .toPromise()
      .catch(this.handleError);
  };
  getTaggedCategories = (ticketId: number) => {
    return this.http.get<TicketCategory[]>(`${this.ticketsUrl}/${ticketId}/tagged-categories`);
  };
  getAssignedUsers = (ticketId: number) => {
    return this.http.get<User[]>(`${this.ticketsUrl}/${ticketId}/assigned-users`);
  };
  updateAssignments = (ticketId: number, assignedUsers: number[], unassignedUsers: number[]) => {
    const url = `${this.ticketsUrl}/${ticketId}/assign`;
    return this.http.put<User[]>(
      url,
      JSON.stringify({ added: assignedUsers, removed: unassignedUsers }),
      this.options).pipe<User[]>(
        catchError(this.handleError<any>('updateAssignments'))
      );
  };
  update = (ticket: Ticket) => {
    const url = `${this.ticketsUrl}/${ticket.id}`;
    return this.http.put<Ticket>(
      url,
      ticket,
      this.options);
  };
  create = (description: string, taggedCategoryIds: number[]) => {
    return this.http
      .post<Ticket>(
        this.ticketsUrl,
        JSON.stringify({
          description,
          taggedCategoryIds
        }),
        this.options).pipe<Ticket>(
          catchError(this.handleError<any>('createTicket'))
        );
  };
  delete = (id: number) => {
    const url = `${this.ticketsUrl}/${id}`;
    return this.http.delete(url);
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
