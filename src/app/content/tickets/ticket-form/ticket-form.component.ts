import { Component, OnInit, Input } from '@angular/core';
import { TicketCategory } from '../../../models/ticket-category';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TicketService } from 'src/app/service/ticket/ticket.service';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Tag } from 'src/app/models/tag';
import { Ticket } from 'src/app/models/ticket';

@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.scss']
})
export class TicketFormComponent implements OnInit {
  @Input() ticket$: Observable<Ticket>;
  public ticket: Ticket;
  public categories: TicketCategory[];
  public ticketForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
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
    if (this.ticket?.id) {
      // Ticket passed in by parent component, no need to fetch
      this.populateFormFields();
      return;
    }

    this.ticket$.subscribe({
      next: (ticket: Ticket) => {
        this.ticket = new Ticket({ ...ticket });

        if (this.ticket?.id) {
          this.populateFormFields();
        }
      },
    });

    this.ticketService.getTicketCategories().subscribe((categories: TicketCategory[]) => {
      this.categories = categories;
    });
  }

  goBack(): void {
    window.history.back();
  }

  onTicketSubmit() {
    const formVals = this.ticketForm.value;
    const ticketData = new Ticket({
      ...formVals
    });

    if (this.ticketForm.controls.taggedCategories.dirty) {
      const taggedCategoryIds: number[] = formVals.taggedCategories;
      ticketData.tags = taggedCategoryIds.map(cid => {
        const tagFound = this.ticket?.tags?.find(tag => tag.category.id === cid);
        return {
          id: tagFound?.id || undefined,
          ticketId: this.ticket.id,
          categoryId: cid
        } as Tag;
      });
    }

    let submitResult: Observable<any>;
    if (this.ticket.id) {
      // Update
      ticketData.id = this.ticket.id;
      submitResult = this.ticketService.update(ticketData);
    } else {
      // Create
      ticketData.creatorId = this.authService.currentUserValue.id;
      submitResult = this.ticketService.create(ticketData);
    }

    submitResult.subscribe((updatedResource) => {
      if (updatedResource?.length > 0) {return this.goBack();}

      throw new Error(`Ticket ${this.ticket.id ? 'Create': 'Update'} failed`);
    });
  }

  private populateFormFields() {
    this.ticketForm.setValue({
      taggedCategories: this.ticket.tags?.map((tag) => tag.category.id) || [],
      description: this.ticket.description
    });
  }
}
