import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Ticket } from './ticket';

@Component({
  selector: 'ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.scss']
})
export class TicketCreateComponent implements OnInit {
  public ticket: Ticket;

  constructor(
    private route: ActivatedRoute,
  ) {
    this.ticket = new Ticket();
  }

  ngOnInit(): void {
    // this.route.data
    //   .subscribe((data: { ticket: Ticket }) => {
    //     this.ticket = data.ticket;
    //   });
  }
}