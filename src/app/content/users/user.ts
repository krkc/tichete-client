import { Ticket } from '../tickets/ticket';
import { TicketCategory } from '../tickets/category';

export class User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    token?: string;

    _links: any;
    _embedded: any;

    assignedTickets?: Ticket[];
    submittedTickets?: Ticket[];
    subscribedCategories?: TicketCategory[];
}
