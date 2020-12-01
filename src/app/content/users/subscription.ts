import { TicketCategory } from '../tickets/ticket-category';
import { Base } from '../base/base';
import { User } from './user';

export class Subscription extends Base {
  userId: number;
  categoryId: number;

  user: User;
  category: TicketCategory;
}
