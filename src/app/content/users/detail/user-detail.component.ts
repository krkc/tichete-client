import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from '../user';
import { TicketService } from 'src/app/service/ticket.service';

@Component({
  selector: 'my-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  public user: User;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
  ) { }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { user: User }) => {
        this.user = data.user;
      });
  }
}
