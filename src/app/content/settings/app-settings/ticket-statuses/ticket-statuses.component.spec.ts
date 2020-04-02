import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketStatusesComponent } from './ticket-statuses.component';

describe('TicketStatusesComponent', () => {
  let component: TicketStatusesComponent;
  let fixture: ComponentFixture<TicketStatusesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketStatusesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
