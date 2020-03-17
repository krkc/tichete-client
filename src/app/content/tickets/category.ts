import { User } from '../users/user';
import { Ticket } from './ticket';

export class TicketCategory {
    id: number;
    name: string;

    taggedTickets: Ticket[];
    subscribedUsers: User[];
}
