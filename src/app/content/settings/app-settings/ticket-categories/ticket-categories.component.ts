import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TicketService } from 'src/app/service/ticket.service';
import { TicketCategory } from '../../../tickets/ticket-category';

import * as alertify from 'alertifyjs';

@Component({
  selector: 'manage-ticket-categories',
  templateUrl: './ticket-categories.component.html',
  styleUrls: ['./ticket-categories.component.scss']
})
export class TicketCategoriesComponent implements OnInit {
  public ticketCategoriesData: Observable<TicketCategory[]>;
  public ticketCategories: TicketCategory[];
  public selectedTicketCategory: TicketCategory;
  public ticketCategoryForm: FormGroup;

  constructor(
    private ticketService: TicketService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.ticketCategories = [];
    this.ticketCategoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.ticketCategoriesData = this.ticketService.getTicketCategories();
    this.ticketCategoriesData.subscribe(categories => {
      this.ticketCategories.push(...categories);

      this.route.params.forEach((params: Params) => {
        const ticketCategoryId = +params['id'];
        if (!ticketCategoryId) return;

        this.selectedTicketCategory = this.ticketCategories.find(c => c.id === +params['id']);
        this.ticketCategoryForm.patchValue(this.selectedTicketCategory);
      });
    });
  }

  goBack(): void {
    window.history.back();
  }

  onTicketCategorySubmit() {
    const formVals = this.ticketCategoryForm.value;
    if (this.selectedTicketCategory) {
      formVals.id = this.selectedTicketCategory.id;
      this.ticketService.updateTicketCategory(formVals)
        .subscribe(() => this.router.navigate(['/settings/app/ticket-categories']));
    } else {
      this.ticketService.createTicketCategory(formVals)
      .subscribe(() => {
        this.ticketCategoryForm.reset();
      });
    }
  }

  onTicketCategoryDelete() {
    alertify.confirm('Caution',
      'Are you sure you wish to delete this ticket category?',
      () => {
        this.ticketService.deleteTicketCategory(this.selectedTicketCategory)
          .subscribe(() => this.router.navigate(['/settings/app/ticket-categories']));
      },
      null
    );
  }
}
