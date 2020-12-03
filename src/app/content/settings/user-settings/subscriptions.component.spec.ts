import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { TicketService } from 'src/app/service/ticket.service';
import { UserService } from 'src/app/service/user.service';
import { User } from '../../users/user';

import { SubscriptionsComponent } from './subscriptions.component';

describe('SubscriptionsComponent', () => {
  let component: SubscriptionsComponent;
  let fixture: ComponentFixture<SubscriptionsComponent>;
  let authService: AuthenticationService;

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
        TicketService,
        UserService,
        AuthenticationService,
      ],
      declarations: [ SubscriptionsComponent ]
    })
    .compileComponents();

    authService = TestBed.inject(AuthenticationService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionsComponent);
    component = fixture.componentInstance;
    spyOnProperty(authService, 'currentUserValue', 'get').and.returnValue(new User({ id: 1 }))
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
