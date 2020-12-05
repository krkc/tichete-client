import { Assignment } from './assignment';
import { BaseModel } from './base-model';
import { Ticket } from './ticket';
import { Subscription } from './subscription';

export class User extends BaseModel {
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
