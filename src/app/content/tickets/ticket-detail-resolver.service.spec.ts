import { TestBed } from '@angular/core/testing';

import { TicketDetailResolverService } from './ticket-detail-resolver.service';

describe('TicketDetailResolverService', () => {
  let service: TicketDetailResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketDetailResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
