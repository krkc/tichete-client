import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { TicketService } from 'src/app/service/ticket.service';
import { UserService } from 'src/app/service/user.service';
import { TicketCategory } from '../../tickets/ticket-category';
import { Subscription } from '../../users/subscription';
import { User } from '../../users/user';

@Component({
  selector: 'manage-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  public me$: Observable<User>;
  public me: User;
  public categories: TicketCategory[];
  public subscriptionsForm: FormGroup;

  constructor(
    private ticketService: TicketService,
    private authService: AuthenticationService,
    private userService: UserService,
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

    this.me$ = this.userService.getUser(this.authService.currentUserValue.id);
    this.me$.subscribe({
      next: (me: User) => {
        this.me = me;
        this.subscriptionsForm.setValue({
          subscribedCategories: this.me.subscriptions.map(s => s.category.id)
        });
      }
    });
  }

  onTicketSubmit() {
    if (!this.subscriptionsForm.dirty) return;

    const myUserId = this.authService.currentUserValue.id;
    const subscribedCategoryIds = this.subscriptionsForm.value.subscribedCategories;
    const userData = new User({
      id: myUserId,
    });

    userData.subscriptions = subscribedCategoryIds.map(cid => {
      const subscriptionFound = this.me?.subscriptions?.find(subscription => subscription.category.id === cid);
      return {
        id: subscriptionFound?.id || undefined,
        userId: this.me.id,
        categoryId: cid,
      } as Subscription;
    });

    this.userService.update(userData).subscribe();
  }
}
