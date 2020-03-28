import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ticket } from '../ticket';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'my-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit {
  public ticket: Ticket;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { ticket: Ticket }) => {
        this.ticket = data.ticket;
        this.userService.getUser(this.ticket.creatorId).subscribe(submitter => {
          this.ticket.submittedBy = submitter;
        });
      });
  }
}
