import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { TicketAssignComponent } from './detail/ticket-assign.component';
import { TicketDetailResolverService } from './detail/ticket-detail-resolver.service';
import { TicketDetailComponent } from './detail/ticket-detail.component';
import { TicketCreateComponent } from './ticket-create.component';
import { TicketsComponent } from './tickets.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
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
    ]),
  ],
  exports: [RouterModule],
})
export class TicketsRoutingModule { }
