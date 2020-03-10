import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { Ticket } from '../content/tickets/ticket';
import { TCategory } from '../content/tickets/category';
import { User } from '../content/users/user';
import { TStatus } from '../content/tickets/status';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class TicketService {
  private ticketsUrl = 'api/tickets';  // URL to tickets web api
  private ticketUrl = 'api/ticket'; // URL to ticket web api
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
    const url = `${this.ticketUrl}/${ticketId}`;
    return this.http.get<Ticket>(url);
  };
  getTickets = () => {
    return this.http.get<Ticket[]>(this.ticketsUrl);
  };
  getCategories() {
    return this.http.get<TCategory[]>(this.categoriesUrl);
  };
  getStatuses = () => {
    return this.http.get<TStatus[]>(this.statusesUrl)
      .toPromise()
      .catch(this.handleError);
  };
  getAssignments = (ticketId: number) => {
    return this.http.get<User[]>(`${this.ticketUrl}/${ticketId}/assigned`);
  };
  updateAssignments = (ticketId: number, assignedUsers: number[], unassignedUsers: number[]) => {
    const url = `${this.ticketUrl}/${ticketId}/assign`;
    return this.http.put<User[]>(
      url,
      JSON.stringify({ added: assignedUsers, removed: unassignedUsers }),
      this.options).pipe<User[]>(
        catchError(this.handleError<any>('updateAssignments'))
      );
  };
  update = (ticket: Ticket) => {
    const url = `${this.ticketUrl}/${ticket.Id}`;
    return this.http.put<Ticket>(
      url,
      ticket,
      this.options);
  };
  create = (description: string, categoryId: number) => {
    return this.http
      .post<Ticket>(
        this.ticketUrl,
        JSON.stringify({
          Description: description,
          CategoryId: categoryId
        }),
        this.options).pipe<Ticket>(
          catchError(this.handleError<any>('createTicket'))
        );
  };
  delete = (id: number) => {
    const url = `${this.ticketUrl}/${id}`;
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
