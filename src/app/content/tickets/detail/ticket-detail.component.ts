import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ticket } from '../ticket';
import { User } from '../../users/user';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'my-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit {
  public ticket: Ticket;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.data.pipe(switchMap((data) => data.ticket))
      .subscribe((ticket: Ticket) => {
        this.ticket = new Ticket({...ticket, creator: new User({...ticket.creator})});
      });
  }
}
