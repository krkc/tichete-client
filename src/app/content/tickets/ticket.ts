import { TicketCategory } from './category';
import { User } from '../users/user';
import { TicketStatus } from './status';

export class Ticket {
  id: number;
  name: string;
  description: string;
  submittedById: string;
  submittedOn: Date;
  assignedToId: string;
  categoryId: number;
  statusId: number;
  details: string;

  _links: any;
  _embedded: any;

  status: TicketStatus;
  taggedCategories: TicketCategory[];
  assignedUsers: User[];
}
