import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Ticket } from './ticket';
import { TicketService } from '../../service/ticket.service';
import { TicketCategory } from './category';
/*
TODO: Change this component to ticket-update
TODO: Need component(s) for ticket conversation threads
 */
@Component({
  selector: 'my-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit {
  public categories: TicketCategory[];
  public ticket: Ticket;

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { ticket: Ticket }) => {
        this.ticket = data.ticket;
      });

    this.ticketService.getCategories().subscribe((categories: TicketCategory[]) => {
      this.categories = categories;
    });
  }

  goBack(): void {
    window.history.back();
  }

  save(): void {
    this.ticketService.update(this.ticket)
      .subscribe(this.goBack);
  }
}
