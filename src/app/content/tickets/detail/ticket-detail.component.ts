import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Ticket } from '../ticket';
import { TicketService } from '../../../service/ticket.service';
import { TicketCategory } from '../category';

@Component({
  selector: 'my-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit {
  public categories: TicketCategory[];
  public ticket: Ticket;
  public ticketUpdateForm: FormGroup;

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.ticket = new Ticket();
    this.categories = [];
    this.ticketUpdateForm = this.fb.group({
      taggedCategories: [],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { ticket: Ticket }) => {
        this.ticket = data.ticket;
        this.ticketService.getTaggedCategories(this.ticket).subscribe((taggedCategories) => {
          this.ticket.taggedCategories = taggedCategories
          this.ticketUpdateForm.setValue({
            taggedCategories: this.ticket.taggedCategories.map((tc) => tc.id),
            description: this.ticket.description
          });
        });
      });

    this.ticketService.getCategories().subscribe((categories: TicketCategory[]) => {
      this.categories = categories;
    });
  }

  goBack(): void {
    window.history.back();
  }

  onTicketUpdate() {
    const formVals = this.ticketUpdateForm.value;
    this.ticket.description = formVals.description;

    this.ticketService.update(this.ticket)
      .subscribe(this.goBack);
  }
}
