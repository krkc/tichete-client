import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { TicketCategoryService } from 'src/app/service/ticket/ticket-category.service';
import { TicketStatusService } from 'src/app/service/ticket/ticket-status.service';
import { TicketService } from 'src/app/service/ticket/ticket.service';

import { TicketStatusesComponent } from './ticket-statuses.component';

describe('TicketStatusesComponent', () => {
  let component: TicketStatusesComponent;
  let fixture: ComponentFixture<TicketStatusesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ApolloTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        TicketService,
        TicketCategoryService,
        TicketStatusService,
      ],
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
