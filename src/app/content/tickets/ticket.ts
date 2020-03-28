import { TicketCategory } from './category';
import { User } from '../users/user';
import { TicketStatus } from './status';

export class Ticket {
  id: number;
  name: string;
  description: string;
  creatorId: number;
  createdAt: Date;
  assignedToId: number;
  categoryId: number;
  statusId: number;
  details: string;

  _links: any;
  _embedded: any;

  submittedBy: User;
  status: TicketStatus;
  taggedCategories: TicketCategory[];
  assignedUsers: User[];
}
