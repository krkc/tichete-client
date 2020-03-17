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
    this.ticketService.getStatuses().then((statuses: TicketStatus[]) => {
      this.statuses = statuses;
    });
  }

  onSelect(ticket: Ticket): void {
    if (this.selectedTicket === ticket) {
      this.selectedTicket = null;
    } else {
      this.selectedTicket = this.getPopulatedTicket(ticket, this.statuses);
    }
  }

  onAssign(): void {
    this.router.navigate(['/ticket/assign', this.selectedTicket.id]);
  }

  onEdit(): void {
    this.router.navigate(['/ticket/detail', this.selectedTicket.id]);
  }

  onDelete(ticket: Ticket): void {
    if (this.assignedUsers && this.assignedUsers.length > 0) {
      alertify.confirm('Warning',
        'This ticket is active and has users assigned.' +
        'Assignments must be removed before this ticket can be deleted.' +
        'Would you like to remove assignments?',
        () => { this.router.navigate(['/ticket/assign', ticket.id]); },
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
      .delete(ticket.id)
      .subscribe((err: any) => {
        if (err) {
          alertify.alert('Error', `Error ${err.errno}: ${err.code}`);
          return;
        }

        this.tickets = this.tickets.filter(t => t !== ticket);
        if (this.selectedTicket === ticket) {
          this.selectedTicket = null;
        }
      });
  }

  private getPopulatedTicket(ticket: Ticket, statuses: TicketStatus[]) {
    if (!ticket.status) {
      ticket.status = statuses.find((s) => s.id === ticket.statusId);
    }

    if (!ticket.taggedCategories) {
      this.ticketService
        .getTaggedCategories(ticket.id)
        .subscribe((taggedCategories: TicketCategory[]) => {
          ticket.taggedCategories = taggedCategories;
        });
    }

    if (!ticket.assignedUsers) {
      this.ticketService
        .getAssignedUsers(ticket.id)
        .subscribe((assignedUsers: User[]) => {
          ticket.assignedUsers = assignedUsers;
        });
    }

    return ticket;
  }
}
