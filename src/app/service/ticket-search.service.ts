import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Ticket } from '../content/tickets/ticket';

@Injectable()
export class TicketSearchService {
  constructor(
    private http: HttpClient,
  ) { }
  search(term: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`/api/ticket/search/?Description=${term}`);
  }
}
