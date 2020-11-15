import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Ticket } from './ticket';
import { TicketService } from '../../service/ticket.service';
import { TicketStatus } from './status';
import { User } from '../users/user';

import * as alertify from 'alertifyjs';
import { ApolloError } from '@apollo/client/core';

@Component({
  selector: 'my-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  public statuses: TicketStatus[];
  public tickets: Ticket[];
  public tickets$: Observable<Ticket[]>;
  public selectedTicket: Ticket;
  public assignedUsers: User[];

  constructor(
    private router: Router,
    private ticketService: TicketService) { }

  ngOnInit(): void {
    this.tickets$ = this.ticketService.getTickets();
  }

  onSelect(ticket: Ticket): void {
    if (this.selectedTicket === ticket) {
      this.selectedTicket = null;
    } else {
      this.selectedTicket = ticket;
    }
  }

  onDetail(): void {
    this.router.navigate(['/tickets/detail', this.selectedTicket.id]);
  }

  onDelete(ticket: Ticket): void {
    if (ticket.assignments.length && ticket.assignments.length > 0) {
      alertify.confirm('Warning',
        'This ticket is active and has users assigned. ' +
        'Assignments must be removed before this ticket can be deleted. ' +
        'Would you like to remove assignments?',
        () => { this.router.navigate(['/tickets/assign', ticket.id]); },
        null
      );
      return;
    }

    alertify.confirm('Caution',
      'Are you sure you wish to delete this ticket?',
      () => { this.deleteTicket(ticket); },
      null
    );
  }

  private deleteTicket(ticket: Ticket): void {
    this.ticketService
      .delete(ticket)
      .subscribe({
        next: () => {
          if (this.selectedTicket === ticket) {
            this.selectedTicket = null;
          }
        },
        error: (err: ApolloError) => {
          if (err.graphQLErrors[0]?.extensions?.exception?.code === 'ER_ROW_IS_REFERENCED_2') {
            alertify.alert(
              'Can Not Delete',
              'There are relationships associated with this ticket.\n ' +
              'Remove the relationships first and try again.');
            return;
          }
        }
    });
  }
}
