import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket } from '../models/ticket';

@Injectable()
export class TicketSearchService {
  constructor(
  ) { }
  search(term: string): Observable<Ticket[]> {
    throw new Error('Not implemented');
  }
}
