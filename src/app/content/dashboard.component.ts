import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Ticket } from './tickets/ticket';
import { TicketService } from '../service/ticket.service';
import { AuthenticationService } from '../service/authentication.service';
import { Observable } from "rxjs";

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tickets: Ticket[];
  isLoggedIn$: Observable<boolean>;
  constructor(
    private router: Router,
    private ticketService: TicketService,
    private authService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();
    this.isLoggedIn$.subscribe(loggedInResponse => {
      if (loggedInResponse) {
        this.ticketService.getTickets().subscribe(response => {
          this.tickets = response.slice(1, 5);
        });
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  gotoDetail(ticket: Ticket): void {
    this.router.navigate(['/ticket/detail', ticket.Id]);
  }
}
