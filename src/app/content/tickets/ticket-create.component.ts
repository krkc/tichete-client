import { Component } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Ticket } from './ticket';

@Component({
  selector: 'ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.scss']
})
export class TicketCreateComponent {
  public ticket$: Observable<Ticket>;
  public ticket: Ticket;

  constructor() {
    this.ticket$ = of(new Ticket());
    this.ticket$.subscribe(ticket => this.ticket = ticket);
  }
}
