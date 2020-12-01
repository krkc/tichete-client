import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { TicketsComponent } from './content/tickets/tickets.component';
import { TicketDetailComponent } from './content/tickets/detail/ticket-detail.component';
import { TicketCreateComponent } from './content/tickets/ticket-create.component';
import { DashboardComponent } from './content/dashboard.component';
import { TicketAssignComponent } from './content/tickets/detail/ticket-assign.component';
import { UsersComponent } from './content/users/users.component';
import { UserDetailComponent } from './content/users/detail/user-detail.component';
import { UserCreateComponent } from './content/users/user-create.component';
import { UserAssignComponent } from './content/users/detail/user-assign.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { UserDetailResolverService } from './content/users/detail/user-detail-resolver.service';
import { TicketDetailResolverService } from './content/tickets/detail/ticket-detail-resolver.service';
import { UserSettingsComponent } from './content/settings/user-settings/user-settings.component';
import { AppSettingsComponent } from './content/settings/app-settings/app-settings.component';
import { TicketCategoriesComponent } from './content/settings/app-settings/ticket-categories/ticket-categories.component';
import { TicketStatusesComponent } from './content/settings/app-settings/ticket-statuses/ticket-statuses.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: HomeLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'tickets',
        children: [
          {
            path: '',
            component: TicketsComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'create',
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
            component: TicketAssignComponent,
            resolve: {
              ticket: TicketDetailResolverService
            }
          }
        ],
        canActivate: [AuthGuard]
      },
      {
        path: 'users',
        children: [
          {
            path: '',
            component: UsersComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'create',
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
            component: UserAssignComponent,
            resolve: {
              user: UserDetailResolverService
            }
          }
        ],
        canActivate: [AuthGuard]
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'settings/user',
        component: UserSettingsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'settings/app',
        component: AppSettingsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'settings/app/ticket-categories',
        children: [
          {
            path: '',
            component: TicketCategoriesComponent,
            canActivate: [AuthGuard]
          },
          {
            path: ':id',
            component: TicketCategoriesComponent,
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'settings/app/ticket-statuses',
        children: [
          {
            path: '',
            component: TicketStatusesComponent,
            canActivate: [AuthGuard]
          },
          {
            path: ':id',
            component: TicketStatusesComponent,
            canActivate: [AuthGuard]
          }
        ]

      }
    ]
  }
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routes);

@NgModule({
  imports: [routing],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
