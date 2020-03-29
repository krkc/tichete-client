import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Ticket } from './tickets/ticket';
import { AuthenticationService } from '../service/authentication.service';
import { Observable } from "rxjs";
import { UserService } from '../service/user.service';
import { TicketService } from '../service/ticket.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  myTickets: Ticket[];
  feedTickets: Ticket[];

  constructor(
    private router: Router,
    private userService: UserService,
    private ticketService: TicketService,
  ) { }

  ngOnInit(): void {
    this.userService.getMyTickets().subscribe((response) => {
      this.myTickets = response.slice(1, 5);
    });
    this.userService.getTicketFeed().subscribe((response) => {
      this.feedTickets = response.slice(1, 5);
    });        
  }

  gotoDetail(ticket: Ticket): void {
    this.router.navigate(['/ticket/detail', ticket.id]);
  }
}
