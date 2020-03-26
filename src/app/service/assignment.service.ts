import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, mergeMap, map } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';

import { Assignment } from '../content/assignment';
import { User } from '../content/users/user';
import { Ticket } from '../content/tickets/ticket';
import { Router, UrlTree } from '@angular/router';

@Injectable()
export class AssignmentService {
  private apiUrl = 'api';
  private assignmentsUrl = `${this.apiUrl}/users/assignments`;
  private headers: HttpHeaders;
  private options;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json', });
    this.options = { headers: this.headers };
  }

  getAssignments = (options?: { user?: User, ticket?: Ticket }) => {
    const getAssignmentsUrl = this.router.parseUrl(this.assignmentsUrl);
    if (options?.user) {
      getAssignmentsUrl.queryParams['userId'] = options.user.id;
    }
    if (options?.ticket) {
      getAssignmentsUrl.queryParams['ticketId'] = options.ticket.id;
    }

    return this.http.get<any>(getAssignmentsUrl.toString())
      .pipe(
        map((assignmentsData) => assignmentsData._embedded.assignments as Assignment[]));
  };

  create = (user: User, ticket: Ticket) => {
    const createAssignmentUrl = `${this.apiUrl}/users/${user.id}/assigned-tickets/${ticket.id}`;
    return this.http.post<Assignment>(
      createAssignmentUrl,
      null,
      this.options).pipe<Assignment>(
        catchError(this.handleError<any>('createAssignment'))
      );
  };

  delete = (assignment: Assignment) => {
    const deleteAssignmentUrl = `${this.apiUrl}${assignment._links.self.href}`;
    return this.http.delete(deleteAssignmentUrl);
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
