export class TicketStatus {
  id: number;
  name: string;
  description: string;
  createdAt: Date;

  _links: any;
  _embedded: any;

  constructor(data?: any) {
    if (!data) return;

    for (let key in data) {
        this[key] = data[key];
    }
  }
}
