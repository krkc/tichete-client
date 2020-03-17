import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Ticket } from './ticket';
import { TicketService } from '../../service/ticket.service';
import { TicketCategory } from './category';
import { FormControl, FormGroup, RequiredValidator } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import * as $ from 'jquery';

@Component({
  selector: 'ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.scss']
})
export class TicketCreateComponent implements OnInit {
  public categories: TicketCategory[];
  public ticket: Ticket;
  // public category: string;
  public ticketCreateForm: FormGroup;

  constructor(
    private router: Router,
    private ticketService: TicketService,
  ) {
    this.ticket = new Ticket();
    this.categories = [];
  }

  async ngOnInit() {
    this.ticketService.getCategories().subscribe(categories => this.categories = categories);
    this.ticketCreateForm = new FormGroup({
      tagSelector: new FormControl(),
      description: new FormControl(this.ticket.description),
    });
  }

  onSubmit() {
    const vals = this.ticketCreateForm.value;
    const description = vals.description.trim();
    this.ticketService.create(description, vals.tagSelector).subscribe(newTicket => this.ticket = newTicket);
    // TODO: Throws exception "$(...).modal is not a function" when user no longer authenticated
    // this.router.navigate(['/detail', newTicket.Id]);
    // this.category = this.categories.find(c => c.id.toString() === this.ticket.categoryId.toString()).name;
    ($('#summary-modal') as any).modal();
    $('#summary-modal').on('hidden.bs.modal', () => {
      this.router.navigate(['tickets']);
    });
  }
}
