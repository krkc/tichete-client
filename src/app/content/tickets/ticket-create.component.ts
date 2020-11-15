import { Component } from '@angular/core';

import { Ticket } from './ticket';

@Component({
  selector: 'ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.scss']
})
export class TicketCreateComponent {
  public ticket: Ticket;

  constructor() {
    this.ticket = new Ticket();
  }
}
