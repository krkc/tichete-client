import { Component, OnInit, Input } from '@angular/core';
import { TicketCategory } from '../category';
import { Ticket } from '../ticket';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TicketService } from 'src/app/service/ticket.service';
import { Tag } from '../tag';

@Component({
  selector: 'ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.scss']
})
export class TicketFormComponent implements OnInit {
  @Input() ticket: Ticket;
  public categories: TicketCategory[];
  public ticketForm: FormGroup;

  constructor(
    private ticketService: TicketService,
    private fb: FormBuilder
  ) {
    this.categories = [];
    this.ticketForm = this.fb.group({
      taggedCategories: [],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.ticketService.getTicketCategories().subscribe((categories: TicketCategory[]) => {
      this.categories = categories;
      if (!this.ticket.id) return;

      this.ticketForm.setValue({
        taggedCategories: this.ticket.tags.map((tag) => tag.category.id),
        description: this.ticket.description
      });
    });
  }

  goBack(): void {
    window.history.back();
  }

  onTicketSubmit() {
    const formVals = this.ticketForm.value;
    const taggedCategoryIds: number[] = formVals.taggedCategories;
    this.ticket.description = formVals.description;
    if (taggedCategoryIds) {
      this.ticket.tags = taggedCategoryIds.map(cid => {
        const tagFound = this.ticket.tags.find(tag => tag.category.id === cid);
        return {
          id: tagFound?.id || undefined,
          ticketId: this.ticket.id,
          categoryId: cid
        } as Tag;
      });
    } else {
      this.ticket.tags = [];
    }

    if (this.ticket.id) {
      this.ticketService.update(this.ticket)
      .subscribe((updatedTicket) => {
        if (updatedTicket.length > 0) return this.goBack();

        console.log('ticket-form.update', updatedTicket);
      });
    } else {
      this.ticketService.create(this.ticket)
      .subscribe((createdTicket) => {
        if (createdTicket.length > 0) return this.goBack();

        console.log('ticket-form.create', createdTicket);
      });
    }
  }
}
