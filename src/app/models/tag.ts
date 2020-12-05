import { BaseModel } from './base-model';
import { Ticket } from './ticket';
import { TicketCategory } from './ticket-category';

export class Tag extends BaseModel {
  ticketId: number;
  categoryId: number;

  ticket: Ticket;
  category: TicketCategory;
}
