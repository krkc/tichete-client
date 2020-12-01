import { TicketCategory } from './ticket-category';
import { Base } from '../base/base';
import { Ticket } from './ticket';

export class Tag extends Base {
  ticketId: number;
  categoryId: number;

  ticket: Ticket;
  category: TicketCategory;
}
