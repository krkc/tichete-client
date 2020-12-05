import { TicketCategory } from './ticket-category';
import { BaseModel } from './base-model';
import { User } from './user';

export class Subscription extends BaseModel {
  userId: number;
  categoryId: number;

  user: User;
  category: TicketCategory;
}
