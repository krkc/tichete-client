import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './content/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { UserSettingsComponent } from './content/settings/user-settings/user-settings.component';
import { HomeLayoutComponent } from './shared-content/layouts/home-layout/home-layout.component';
import { LoginComponent } from './shared-content/login/login.component';

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
        loadChildren: () => import('./content/tickets/tickets-routing.module').then(m => m.TicketsRoutingModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'users',
        loadChildren: () => import('./content/users/users-routing.module').then(m => m.UsersRoutingModule),
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
        loadChildren: () => import('./content/settings/app-settings/app-settings-routing.module').then(m => m.AppSettingsRoutingModule),
      },
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
