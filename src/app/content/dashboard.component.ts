import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../service/authentication.service';
import { map } from 'rxjs/operators';
import { UserService } from '../service/user/user.service';
import { Ticket } from '../models/ticket';
import { User } from '../models/user';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  me$: Observable<User>;
  hasTickets: boolean = false;
  hasFeed: boolean = false;
  myTickets$: Observable<Ticket[]>;
  feedTickets$: Observable<Ticket[]>;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.me$ = this.userService.getOne(this.authService.currentUserValue.id);
    this.myTickets$ = this.me$.pipe(map((user: User) => {
      return user.submittedTickets.slice(1,5) as Ticket[];
    }));

    this.me$.subscribe({
      next: (user) => {
        this.hasTickets = (user.submittedTickets.length && user.submittedTickets.length > 0) ? true : false;
      }
    });

    this.feedTickets$ = this.userService.getTicketFeed().pipe(map(tickets => {
      if (tickets.length > 0) {
        this.hasFeed = true;
      }
      return tickets.slice(1,5) as Ticket[];
    }));
  }
}
