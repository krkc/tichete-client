import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from './service/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }
}
