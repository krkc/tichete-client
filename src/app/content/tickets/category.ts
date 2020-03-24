import { User } from '../users/user';
import { Ticket } from './ticket';

export class TicketCategory {
    id: number;
    name: string;

    _links: any;
    _embedded: any;

    taggedTickets: Ticket[];
    subscribedUsers: User[];
}
