import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Ticket } from './ticket';
import { TicketService } from '../../service/ticket.service';
import { TCategory } from './category';
/*
TODO: Change this component to ticket-update
TODO: Need component(s) for ticket conversation threads
 */
@Component({
  selector: 'my-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit {
  public categories: TCategory[];
  public ticket: Ticket;

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      let id = +params['id'];
      this.ticketService.getTicket(id)
        .subscribe(ticket => this.ticket = ticket);
    });

    this.ticketService.getCategories().subscribe((_categories: TCategory[]) => {
      this.categories = _categories;
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
