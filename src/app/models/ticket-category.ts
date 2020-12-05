import { BaseModel } from './base-model';
import { Tag } from './tag';
import { Subscription } from './subscription';

export class TicketCategory extends BaseModel {
    name: string;

    tags: Tag[];
    subscriptions: Subscription[];
}
