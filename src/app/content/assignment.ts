import { Base } from './base/base';
import { User } from './users/user';
import { Ticket } from './tickets/ticket';

export class Assignment extends Base {
  userId: number;
  ticketId: number;

  user: User;
  ticket: Ticket;
}
