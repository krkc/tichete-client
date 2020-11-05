import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Ticket } from './ticket';
import { TicketService } from '../../service/ticket.service';
import { TicketCategory } from './category';
import { TicketStatus } from './status';
import { User } from '../users/user';

import * as alertify from 'alertifyjs';

@Component({
  selector: 'my-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  public statuses: TicketStatus[];
  public tickets: Ticket[];
  public selectedTicket: Ticket;
  public assignedUsers: User[];

  constructor(
    private router: Router,
    private ticketService: TicketService) { }

  ngOnInit(): void {
    this.ticketService.getTickets().subscribe((tickets: Ticket[]) => {
      this.tickets = tickets;
    });
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
    if (this.assignedUsers && this.assignedUsers.length > 0) {
      alertify.confirm('Warning',
        'This ticket is active and has users assigned.' +
        'Assignments must be removed before this ticket can be deleted.' +
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
      .subscribe((err: any) => {
        // TODO: I believe this was for warning of conflicts
        // ex: 'Error: Cannot delete a ticket that is actively assigned.'
        // Disable it for now, might reimplement.
        // if (err) {
        //   alertify.alert('Error', `Error ${err.errno}: ${err.code}`);
        //   return;
        // }

        this.tickets = this.tickets.filter(t => t !== ticket);
        if (this.selectedTicket === ticket) {
          this.selectedTicket = null;
        }
      });
  }
}
