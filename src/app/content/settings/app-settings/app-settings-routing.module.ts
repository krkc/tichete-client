import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AppSettingsComponent } from './app-settings.component';
import { RolesComponent } from './roles/roles.component';
import { TicketCategoriesComponent } from './ticket-categories/ticket-categories.component';
import { TicketStatusesComponent } from './ticket-statuses/ticket-statuses.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: AppSettingsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'ticket-categories',
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
        path: 'ticket-statuses',
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
      },
      {
        path: 'roles',
        children: [
          {
            path: '',
            component: RolesComponent,
            canActivate: [AuthGuard]
          },
          {
            path: ':id',
            component: RolesComponent,
            canActivate: [AuthGuard]
          }
        ]
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AppSettingsRoutingModule { }
