import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { TicketCategoryService } from 'src/app/service/ticket/ticket-category.service';
import { TicketStatusService } from 'src/app/service/ticket/ticket-status.service';
import { TicketService } from 'src/app/service/ticket/ticket.service';

import { TicketDetailResolverService } from './ticket-detail-resolver.service';

describe('TicketDetailResolverService', () => {
  let service: TicketDetailResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ApolloTestingModule,
        RouterTestingModule,
      ],
      providers: [
        TicketService,
        TicketCategoryService,
        TicketStatusService,
      ],
    });
    service = TestBed.inject(TicketDetailResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
