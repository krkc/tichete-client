import { Base } from '../base/base';
import { Tag } from './tag';
import { Subscription } from '../users/subscription';

export class TicketCategory extends Base {
    name: string;

    tags: Tag[];
    subscriptions: Subscription[];
}
