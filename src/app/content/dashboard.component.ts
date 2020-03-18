import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Ticket } from './tickets/ticket';
import { AuthenticationService } from '../service/authentication.service';
import { Observable } from "rxjs";
import { UserService } from '../service/user.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  feedTickets: Ticket[];
  isLoggedIn$: Observable<boolean>;
  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();
    this.isLoggedIn$.subscribe(loggedInResponse => {
      if (loggedInResponse) {
        this.authService.currentUserValue;
        this.userService.getTicketFeed().subscribe((response) => {
          this.feedTickets = response.slice(1, 5);
        });
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  gotoDetail(ticket: Ticket): void {
    this.router.navigate(['/ticket/detail', ticket.id]);
  }
}
