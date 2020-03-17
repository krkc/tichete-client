import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';

import * as $ from 'jquery';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public emailInput: string;
  public passwdInput: string;
  public credsInvalid: boolean;
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onLogin = () => {
    this.credsInvalid = false;
    this.authService.login(this.emailInput, this.passwdInput)
      .then(this.onLoginSuccess)
      .catch(this.onLoginError);
  }

  onLoginSuccess = (user) => {
    $('.login-container')
      .css('transform', 'translateY(-30em)');

    setTimeout(() => { this.router.navigate(['']); }, 300);
  }

  onInvalidCredentials = (statusCode: string) => {
    this.credsInvalid = true;
  }

  onLoginError = (error: string) => {
    console.log('Login Error: ' + error);
  }
}
