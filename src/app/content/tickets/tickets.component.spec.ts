/* eslint-disable @typescript-eslint/no-unused-vars */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketsComponent } from './tickets.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TicketService } from 'src/app/service/ticket/ticket.service';
import { TicketCategoryService } from 'src/app/service/ticket/ticket-category.service';
import { TicketStatusService } from 'src/app/service/ticket/ticket-status.service';

describe('TicketsComponent', () => {
  let component: TicketsComponent;
  let fixture: ComponentFixture<TicketsComponent>;

  beforeEach(async(() => {
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
      declarations: [ TicketsComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
