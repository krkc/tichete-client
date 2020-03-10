import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Ticket } from './ticket';
import { TicketService } from '../../service/ticket.service';
import { TCategory } from './category';

@Component({
  selector: 'ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.css']
})
export class TicketCreateComponent implements OnInit {
  public categories: TCategory[];
  public ticket: Ticket;
  public category: string;

  constructor(
    private router: Router,
    private ticketService: TicketService,
  ) { }

  async ngOnInit() {
    this.ticketService.getCategories().subscribe(categories => this.categories = categories);
  }

  async add(description: string, categoryId: number): Promise<void> {
    description = description.trim();
    if (!description || !categoryId) { return; }
    this.ticketService.create(description, categoryId).subscribe(newTicket => this.ticket = newTicket);
    // TODO: Throws exception "$(...).modal is not a function" when user no longer authenticated
    // this.router.navigate(['/detail', newTicket.Id]);
    this.category = this.categories.find(c => c.Id.toString() === this.ticket.CategoryId.toString()).Name;
    const _$: any = $;
    _$('#summary-modal').modal();
    _$('#summary-modal').on('hidden.bs.modal', () => {
      this.router.navigate(['tickets']);
    });
  }
}
