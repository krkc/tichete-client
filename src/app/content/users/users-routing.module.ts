import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { UserAssignComponent } from './detail/user-assign.component';
import { UserDetailResolverService } from './detail/user-detail-resolver.service';
import { UserDetailComponent } from './detail/user-detail.component';
import { UserCreateComponent } from './user-create.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
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
    ]),
  ],
  exports: [RouterModule],
})
export class UsersRoutingModule { }
