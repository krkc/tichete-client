import { Assignment } from './assignment';
import { BaseModel } from './base-model';
import { Ticket } from './ticket';
import { Subscription } from './subscription';
import { Role } from './role';

export class User extends BaseModel {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    accessToken?: string;

    role?: Role;
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
