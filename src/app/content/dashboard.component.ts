import { Component, OnInit } from '@angular/core';

import { Ticket } from './tickets/ticket';
import { UserService } from '../service/user.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  myTickets: Ticket[];
  feedTickets: Ticket[];

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.getMyTickets().subscribe((response) => {
      this.myTickets = response.slice(1, 5);
    });
    this.userService.getTicketFeed().subscribe((response) => {
      this.feedTickets = response.slice(1, 5);
    });        
  }
}
