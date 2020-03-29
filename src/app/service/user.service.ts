import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { User } from '../content/users/user';
import { Ticket } from '../content/tickets/ticket';
import { Observable, forkJoin, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class UserService {
  private apiUrl: string = '/api';
  private usersUrl: string = `${this.apiUrl}/users`;
  private headers: HttpHeaders;
  private options: { headers: HttpHeaders };
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
  ) {
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.options = { headers: this.headers };
  }

  getUser = (userId: number) => {
    const url = `${this.usersUrl}/${userId}`;
    return this.http.get<User>(url)
      .pipe(map(user => new User(user)));
  };

  getUsers = () => {
    return this.http.get<any>(this.usersUrl)
      .pipe(
        map((usersData) => usersData._embedded.users as User[]),
        mergeMap((users) => {
          return forkJoin(users.map((userData) => {
            return this.http.get<User>(`${this.apiUrl}/${userData._links.self.href}`)
              .pipe(
                map(user => new User(user))
              )
          }))
        })
      );
  };

  create(user: User) {
    return this.http
      .post<User>(this.usersUrl,
        JSON.stringify(user), this.options).pipe<User>(
          catchError(this.handleError<User>('createUser'))
        );
  }

  update(user: User) {
    const updateUsersUrl = `${this.apiUrl}${user._links.self.href}`;
    return this.http
      .put<User>(updateUsersUrl, JSON.stringify(user), this.options)
      .pipe(map(user => new User(user)));
  }

  delete(user: User) {
    const deleteUserUrl = `${this.apiUrl}${user._links.self.href}`;
    return this.http.delete(deleteUserUrl);
  }

  getMyTickets = (): Observable<Ticket[]> => {
    const submittedTicketsUrl = `${this.apiUrl}${this.authService.currentUserValue._links.submittedTickets.href}`;
    return this.http.get<any>(submittedTicketsUrl)
      .pipe(
        map((ticketsData) => ticketsData._embedded.tickets as Ticket[]),
        mergeMap((tickets) => {
          return forkJoin(tickets.map((ticket) => this.http.get<Ticket>(`${this.apiUrl}/${ticket._links.self.href}`)))
        })
      );
  };

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

  getAssignments = (user: User) => {
    const getAssignedTicketsUrl = `${this.apiUrl}${user._links.assignedTickets.href}`;

    return this.http.get<any>(getAssignedTicketsUrl)
      .pipe(
        map((ticketsData) => ticketsData._embedded.tickets as Ticket[]),
        mergeMap((tickets) => {
          return forkJoin(tickets.map((ticket) => this.http.get<Ticket>(`${this.apiUrl}/${ticket._links.self.href}`)))
        })
      );
  }

  updateAssignments = (user: User, toAssignTicketIds: number[], toUnassignTicketIds: number[]) => {
    const assignedTicketsUrl = `${this.apiUrl}${user._links.assignedTickets.href}`;
    const additionsAndRemovals = JSON.stringify({
      added: toAssignTicketIds,
      removed: toUnassignTicketIds
    });
    return this.http.put<Ticket[]>(assignedTicketsUrl, additionsAndRemovals, this.options)
      .pipe<Ticket[]>(
        catchError(this.handleError<Ticket[]>('updateAssignments'))
      );
  }

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
