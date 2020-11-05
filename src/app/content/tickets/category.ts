import { Base } from '../base/base';
import { User } from '../users/user';
import { Ticket } from './ticket';

export class TicketCategory extends Base {
    name: string;
    description: string;
    createdAt: Date;

    _links: any;
    _embedded: any;

    taggedTickets: Ticket[];
    subscribedUsers: User[];
}
