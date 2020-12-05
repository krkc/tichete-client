import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'navi-pane',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  naviHeading = 'Tichete Ticketing System';
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  public logOut() {
    this.authService.logout();
    this.router.navigate(['dashboard']);
  }
}
