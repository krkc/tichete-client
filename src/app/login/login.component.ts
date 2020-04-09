import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';

import * as $ from 'jquery';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public credsInvalid: boolean;
  public loginForm: FormGroup;
  public requestPending: boolean;
  public errorMessage: string;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLoginSubmit = () => {
    this.requestPending = true;
    const formVals = this.loginForm.value;
    
    this.credsInvalid = false;
    this.authService.login(formVals.email, formVals.password)
      .then(this.onLoginSuccess)
      .catch(this.onLoginError);
  }

  onLoginSuccess = () => {
    $('.login-card')
      .css('transform', 'translateY(-30em)');

    setTimeout(() => { this.router.navigate(['']); }, 300);
  }

  onLoginError = (error: any) => {
    this.requestPending = false;
    this.credsInvalid = (error.status === 401);
  }
}
