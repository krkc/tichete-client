import { Component, OnInit, Input } from '@angular/core';
import { TicketCategory } from '../ticket-category';
import { Ticket } from '../ticket';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TicketService } from 'src/app/service/ticket.service';
import { Tag } from '../tag';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.scss']
})
export class TicketFormComponent implements OnInit {
  @Input() ticket: Ticket;
  public ticket$: Observable<Ticket>;
  public categories: TicketCategory[];
  public ticketForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
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

    this.ticket$ = this.route.data.pipe(switchMap((data) => data.ticket)) as Observable<Ticket>;
    this.ticket$.subscribe({
      next: (ticket: Ticket) => {
        this.ticket = new Ticket({ ...ticket });
        this.populateFormFields();
      },
      error: () => {
        // 'Create' form
        return
      }
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

    if (this.ticketForm.controls['taggedCategories'].dirty) {
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

    if (this.ticket.id) {
      // Update
      ticketData.id = this.ticket.id;
      this.ticketService.update(ticketData)
      .subscribe((updatedTicket) => {
        if (updatedTicket?.length > 0) return this.goBack();

        console.log('ticket-form.update', updatedTicket);
      });
    } else {
      // Create
      ticketData.creatorId = this.authService.currentUserValue.id;
      this.ticketService.create(ticketData)
      .subscribe((createdTicket) => {
        if (createdTicket?.length > 0) return this.goBack();

        console.log('ticket-form.create', createdTicket);
      });
    }
  }

  private populateFormFields() {
    this.ticketForm.setValue({
      taggedCategories: this.ticket.tags?.map((tag) => tag.category.id) || [],
      description: this.ticket.description
    });
  }
}
