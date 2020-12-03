import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { TicketService } from 'src/app/service/ticket.service';

import { TicketCategoriesComponent } from './ticket-categories.component';

describe('TicketCategoriesComponent', () => {
  let component: TicketCategoriesComponent;
  let fixture: ComponentFixture<TicketCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ApolloTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        TicketService,
      ],
      declarations: [ TicketCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
