import { User } from './users/user';
import { Ticket } from './tickets/ticket';

export class Assignment {
  id: number;
  userId: number;
  ticketId: number;

  _links: any;
  _embedded: any;

  user: User;
  ticket: Ticket;
}
