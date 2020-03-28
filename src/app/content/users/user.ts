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

    constructor(data?: any) {
        if (!data) return;
        
        for (let key in data) {
            this[key] = data[key];
        }
    }

    getDisplayName = () => {
        return `${this.firstName} ${this.lastName}`;
    }
}
