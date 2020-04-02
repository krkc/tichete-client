import { User } from '../users/user';
import { Ticket } from './ticket';

export class TicketCategory {
    id: number;
    name: string;
    createdAt: Date;

    _links: any;
    _embedded: any;

    taggedTickets: Ticket[];
    subscribedUsers: User[];
}
