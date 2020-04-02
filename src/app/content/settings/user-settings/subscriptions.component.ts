import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TicketService } from 'src/app/service/ticket.service';
import { TicketCategory } from '../../tickets/category';

@Component({
  selector: 'manage-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  public categories: TicketCategory[];
  public subscriptionsForm: FormGroup;
  
  constructor(
    private ticketService: TicketService,
    private fb: FormBuilder
  ) {
    this.categories = [];
    this.subscriptionsForm = this.fb.group({
      subscribedCategories: [],
    });
  }

  ngOnInit(): void {
    this.ticketService.getTicketCategories().subscribe((categories: TicketCategory[]) => {
      this.categories = categories;
    });
    // TODO: My subscribed categories (My subscriptions, my feed, etc.)
  }

  onTicketSubmit() {
    
  }
}
