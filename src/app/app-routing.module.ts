import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { TicketsComponent } from './content/tickets/tickets.component';
import { TicketDetailComponent } from './content/tickets/detail/ticket-detail.component';
import { TicketCreateComponent } from './content/tickets/ticket-create.component';
import { DashboardComponent } from './content/dashboard.component';
import { TicketAssignComponent } from './content/tickets/detail/ticket-assign.component';
import { UsersComponent } from './content/users/users.component';
import { UserDetailComponent } from './content/users/user-detail.component';
import { UserCreateComponent } from './content/users/user-create.component';
import { UserAssignComponent } from './content/users/user-assign.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { ContentComponent } from './content/content.component';
import { UserDetailResolverService } from './content/users/user-detail-resolver.service';
import { TicketDetailResolverService } from './content/tickets/detail/ticket-detail-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ContentComponent,
        children: [
          {
            path: '',
            canActivate: [AuthGuard],
            redirectTo: '/dashboard',
            pathMatch: 'full'
          },
          {
            path: 'tickets',
            component: TicketsComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'users',
            component: UsersComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'ticket',
            children: [
              {
                path: '',
                component: TicketCreateComponent
              },
              {
                path: 'detail/:id',
                component: TicketDetailComponent,
                resolve: {
                  ticket: TicketDetailResolverService
                }
              },
              {
                path: 'assign/:id',
                component: TicketAssignComponent
              }
            ],
            canActivate: [AuthGuard]
          },
          {
            path: 'user',
            children: [
              {
                path: '',
                component: UserCreateComponent
              },
              {
                path: 'detail/:id',
                component: UserDetailComponent,
                resolve: {
                  user: UserDetailResolverService
                }
              },
              {
                path: 'assign/:id',
                component: UserAssignComponent
              }
            ],
            canActivate: [AuthGuard]
          },
          {
            path: 'dashboard',
            component: DashboardComponent,
            canActivate: [AuthGuard]
          }
        ]
      }
    ]
  },
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

@NgModule({
  imports: [routing],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
