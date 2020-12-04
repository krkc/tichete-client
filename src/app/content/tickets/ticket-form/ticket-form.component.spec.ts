import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { TicketCategoryService } from 'src/app/service/ticket/ticket-category.service';
import { TicketStatusService } from 'src/app/service/ticket/ticket-status.service';
import { TicketService } from 'src/app/service/ticket/ticket.service';
import { Ticket } from '../ticket';

import { TicketFormComponent } from './ticket-form.component';

describe('TicketFormComponent', () => {
  let component: TicketFormComponent;
  let fixture: ComponentFixture<TicketFormComponent>;
  let controller: ApolloTestingController;
  let ticketService: TicketService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ApolloTestingModule,
        JwtModule.forRoot({}),
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [
        AuthenticationService,
        TicketService,
        TicketCategoryService,
        TicketStatusService,
      ],
      declarations: [ TicketFormComponent ]
    })
    .compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketFormComponent);
    component = fixture.componentInstance;
    component.ticket$ = of(new Ticket());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
