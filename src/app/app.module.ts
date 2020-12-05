import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';

import { TextPreview } from './pipes/text-preview.pipe';
import { UserAssignComponent } from './content/users/detail/user-assign.component';
import { UserCreateComponent } from './content/users/user-create.component';
import { UserDetailComponent } from './content/users/detail/user-detail.component';
import { UsersComponent } from './content/users/users.component';
import { TicketsComponent } from './content/tickets/tickets.component';
import { TicketAssignComponent } from './content/tickets/detail/ticket-assign.component';
import { TicketCreateComponent } from './content/tickets/ticket-create.component';
import { TicketDetailComponent } from './content/tickets/detail/ticket-detail.component';
import { DashboardComponent } from './content/dashboard.component';

import { UserService } from './service/user.service';
import { TicketSearchService } from './service/ticket-search.service';
import { TicketService } from './service/ticket/ticket.service';
import { AuthenticationService } from './service/authentication.service';
import { AssignmentService } from './service/assignment.service';
import { TicketCategoryService } from './service/ticket/ticket-category.service';
import { TicketStatusService } from './service/ticket/ticket-status.service';
import { AuthGuard } from './guards/auth.guard';
import { JwtModule } from '@auth0/angular-jwt';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TicketFormComponent } from './content/tickets/ticket-form/ticket-form.component';
import { UserFormComponent } from './content/users/user-form/user-form.component';
import { UserSettingsComponent } from './content/settings/user-settings/user-settings.component';
import { AppSettingsComponent } from './content/settings/app-settings/app-settings.component';
import { SubscriptionsComponent } from './content/settings/user-settings/subscriptions.component';
import { TicketCategoriesComponent } from './content/settings/app-settings/ticket-categories/ticket-categories.component';
import { TicketStatusesComponent } from './content/settings/app-settings/ticket-statuses/ticket-statuses.component';
import { HomeLayoutComponent } from './shared-content/layouts/home-layout/home-layout.component';
import { LoginComponent } from './shared-content/login/login.component';
import { NavComponent } from './shared-content/nav/nav.component';
import { TicketSearchComponent } from './shared-content/nav/ticket-search.component';
import { User } from './models/user';

export function tokenGetter() {
  return new User({
    ...JSON.parse(localStorage.getItem("current_user"))
  }).accessToken;
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavComponent,
    DashboardComponent,
    TicketDetailComponent,
    TicketCreateComponent,
    TicketAssignComponent,
    TicketsComponent,
    UsersComponent,
    UserDetailComponent,
    UserCreateComponent,
    UserAssignComponent,
    TextPreview,
    TicketSearchComponent,
    HomeLayoutComponent,
    TicketFormComponent,
    UserFormComponent,
    UserSettingsComponent,
    AppSettingsComponent,
    SubscriptionsComponent,
    TicketCategoriesComponent,
    TicketStatusesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:*"],
        disallowedRoutes: ["example.com/examplebadroute/"]
      }
    }),
    GraphQLModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  providers: [
    TicketService,
    TicketSearchService,
    UserService,
    AuthenticationService,
    AssignmentService,
    TicketCategoryService,
    TicketStatusService,
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
