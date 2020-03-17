import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { Observable }        from 'rxjs';
import { Subject }           from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { TicketSearchService } from '../service/ticket-search.service';
import { Ticket } from '../content/tickets/ticket';

@Component({
  selector: 'ticket-search',
  templateUrl: './ticket-search.component.html',
  styleUrls:  ['./ticket-search.component.scss'],
  providers: [TicketSearchService]
})
export class TicketSearchComponent implements OnInit {
  tickets: Observable<Ticket[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private ticketSearchService: TicketSearchService,
    private router: Router) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.tickets = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
      // ignore new term if same as previous term
      distinctUntilChanged(),
      // switch to new search observable each time the term changes
      switchMap((term: string) => this.ticketSearchService.search(term)),
    );
  }

  gotoDetail(ticket: Ticket): void {
    let link = ['/ticket/detail', ticket.id];
    this.router.navigate(link);
  }
}
