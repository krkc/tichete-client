import { BaseModel } from './base-model';
import { Ticket } from './ticket';
import { User } from './user';

export class Assignment extends BaseModel {
  userId: number;
  ticketId: number;

  user: User;
  ticket: Ticket;
}
