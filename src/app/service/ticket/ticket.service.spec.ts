import { TestBed } from '@angular/core/testing';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { Ticket } from 'src/app/models/ticket';
import { TicketCategoryService } from './ticket-category.service';
import { TicketStatusService } from './ticket-status.service';
import { TicketService } from './ticket.service';

describe('TicketService', () => {

  let controller: ApolloTestingController;
  let ticketService: TicketService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [
        TicketService,
        TicketStatusService,
        TicketCategoryService,
      ]
    });

    ticketService = TestBed.inject(TicketService);
    controller = TestBed.inject(ApolloTestingController);

  });

  it('Returns tickets without their relations', () => {

    const take = 2;
    const tickets = [new Ticket({ id: 1, name: 'Test Ticket' })];
    ticketService.getManyNoRels(take).subscribe(_tickets => {
      expect(_tickets.length).toBeDefined();
      expect(_tickets).toContain(_tickets[0]);
    });

    const op = controller.expectOne('GetTicketsMin');
    op.flush({ data: { tickets } });

    expect(op.operation.variables.take).toEqual(take);

  });

  afterEach(() => {

    controller.verify();

  });

});
