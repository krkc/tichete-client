import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { User } from '../content/users/user';
import { Ticket } from '../content/tickets/ticket';
import { Observable, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class UserService {
  private apiUrl = '/api';
  private usersUrl = '/api/users';  // URL to users web api
  private userUrl = '/api/user'; // URL to user web api
  private headers: HttpHeaders;
  private options;
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
  ) {
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.options = { 'headers': this.headers };
  }

  getUser = (userId: number) => {
    const url = `${this.usersUrl}/${userId}`;
    return this.http.get<User>(url);
  };

  getUsers = (): Promise<User[]> => {
    return this.http.get<User[]>(this.usersUrl)
      .toPromise()
      .catch(this.handleError);
  }

  getTicketFeed = (): Observable<Ticket[]> => {
    const subscribedCategoriesUrl = `${this.apiUrl}${this.authService.currentUserValue._links.subscribedTickets.href}`;
    return this.http.get<any>(subscribedCategoriesUrl)
      .pipe(
        map((ticketsData) => ticketsData._embedded.tickets as Ticket[]),
        mergeMap((tickets) => {
          return forkJoin(tickets.map((ticket) => this.http.get<Ticket>(`${this.apiUrl}/${ticket._links.self.href}`)))
        })
      );
  }

  getAssignments = (user: User): Promise<Ticket[]> => {
    const assignedTicketsUrl = `${this.apiUrl}${user._links.assignedTickets.href}`;
    return this.http.get<Ticket[]>(assignedTicketsUrl)
      .toPromise()
      .catch(this.handleError);
  }

  updateAssignments = (user: User, assignedTickets: number[], unassignedTickets: number[]): Promise<Ticket[]> => {
    const url = `${this.userUrl}/${user.id}/assign`;

    return this.http.put<Ticket[]>(url, JSON.stringify({ added: assignedTickets, removed: unassignedTickets }), this.options)
      .toPromise()
      .catch(this.handleError);
  }

  update(user: User): Promise<User> {
    const url = `${this.userUrl}/${user.id}`;
    return this.http
      .put<User>(url, JSON.stringify(user), this.options)
      .toPromise()
      .catch(this.handleError);
  }

  async create(user: User): Promise<User> {
    return this.http
      .post<User>(this.usersUrl,
        JSON.stringify(user), this.options)
      .toPromise()
      .catch(err => this.handleError(err));
  }

  delete(id: number): Promise<void> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.delete(url)
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
