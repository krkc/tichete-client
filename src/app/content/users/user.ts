import { Base } from '../base/base';
import { Ticket } from '../tickets/ticket';
import { TicketCategory } from '../tickets/category';
import { Assignment } from '../assignment';
import { Subscription } from './subscription';

export class User extends Base {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    accessToken?: string;

    _links: any;
    _embedded: any;

    assignments?: Assignment[];
    submittedTickets?: Ticket[];
    subscriptions?: Subscription[];

    getDisplayName = () => {
      if (!this.firstName && !this.lastName) {
        return `${this.email}`;
      }

      return `${this.firstName} ${this.lastName}`;
    }
}
