import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Ticket } from 'src/app/models/ticket';

@Component({
  selector: 'my-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit {
  public ticket$: Observable<Ticket>;
  public ticket: Ticket;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.ticket$ = this.route.data.pipe(switchMap(data => data.ticket)) as Observable<Ticket>;
    this.ticket$.subscribe(ticket => this.ticket = ticket);
  }
}
