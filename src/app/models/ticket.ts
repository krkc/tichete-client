import { BaseModel } from './base-model';
import { TicketStatus } from './status';
import { Tag } from './tag';
import { User } from './user';
import { Assignment } from './assignment';

export class Ticket extends BaseModel {
  name: string;
  description: string;
  creatorId: number;
  assignedToId: number;
  categoryId: number;
  statusId: number;
  details: string;

  _links: any;
  _embedded: any;

  creator: User;
  status: TicketStatus;
  tags: Tag[];
  assignments: Assignment[];
}
