import { User } from '../users/user';
import { TicketStatus } from './status';
import { Base } from '../base/base';
import { Tag } from './tag';
import { Assignment } from '../assignment';

export class Ticket extends Base {
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
