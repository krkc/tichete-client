import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Ticket } from './ticket';
import { TicketService } from '../../service/ticket.service';
import { TicketCategory } from './category';

@Component({
  selector: 'ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.scss']
})
export class TicketCreateComponent implements OnInit {
  public categories: TicketCategory[];
  public ticket: Ticket;
  public ticketCreateForm: FormGroup;

  constructor(
    private router: Router,
    private ticketService: TicketService,
    private fb: FormBuilder
  ) {
    this.categories = [];

    this.ticketCreateForm = this.fb.group({
      tagSelector: [],
      description: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.ticketService.getCategories().subscribe(categories => this.categories = categories);
  }

  onSubmit() {
    const vals = this.ticketCreateForm.value;
    this.ticketService.create(vals.description, vals.tagSelector).subscribe(() => this.router.navigate(['tickets']));
  }
}
