import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Ticket } from './ticket';
import { TicketService } from '../../service/ticket.service';
import { TCategory } from './category';
import { TStatus } from './status';
import { User } from '../users/user';

import * as alertify from 'alertifyjs';

@Component({
  selector: 'my-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  public categories: TCategory[];
  public statuses: TStatus[];
  public tickets: Ticket[];
  public selectedTicket: Ticket;
  public selectedCategory: TCategory;
  public selectedStatus: TStatus;
  public assigned: User[];

  constructor(
    private router: Router,
    private ticketService: TicketService) { }

  ngOnInit(): void {
    this.ticketService.getTickets().subscribe((tickets: Ticket[]) => {
      this.tickets = tickets;
    });
    this.ticketService.getCategories().subscribe((_categories: TCategory[]) => {
      this.categories = _categories;
    });
    this.ticketService.getStatuses().then((_statuses: TStatus[]) => {
      this.statuses = _statuses;
    });
  }

  onSelect(ticket: Ticket): void {
    if (this.selectedTicket === ticket) {
      this.selectedTicket = null;
      this.selectedCategory = null;
      this.selectedStatus = null;
    } else {
      this.selectedTicket = ticket;
      this.selectedCategory = this.categories.find(c => c.Id === ticket.CategoryId) || new TCategory();
      this.selectedStatus = this.statuses.find(s => s.Id === ticket.StatusId) || new TStatus();
    }

    this.ticketService
      .getAssignments(ticket.Id)
      .subscribe((_assignedUsers: User[]) => {
        this.assigned = _assignedUsers;
      });
  }

  onAssign(): void {
    this.router.navigate(['/ticket/assign', this.selectedTicket.Id]);
  }

  onEdit(): void {
    this.router.navigate(['/ticket/detail', this.selectedTicket.Id]);
  }

  onDelete(ticket: Ticket): void {
    if (this.assigned && this.assigned.length > 0) {
      alertify.confirm('Warning',
        'This ticket is active and has users assigned.' +
        'Assignments must be removed before this ticket can be deleted.' +
        'Would you like to remove assignments?',
        () => { this.router.navigate(['/ticket/assign', ticket.Id]); },
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
      .delete(ticket.Id)
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
}
