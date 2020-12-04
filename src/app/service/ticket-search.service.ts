import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket } from '../content/tickets/ticket';

@Injectable()
export class TicketSearchService {
  constructor(
  ) { }
  search(term: string): Observable<Ticket[]> {
    throw new Error('Not implemented');
  }
}
