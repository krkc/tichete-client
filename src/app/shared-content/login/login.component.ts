import { Component } from '@angular/core';
import { Router } from '@angular/router';

import * as $ from 'jquery';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/service/authentication.service';

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
  public loginSuccess: boolean;

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

  onLoginSubmit = async () => {
    this.requestPending = true;
    const formVals = this.loginForm.value;

    this.credsInvalid = false;

    try {
      await this.authService.login(formVals.email, formVals.password);

      this.onLoginSuccess();
    } catch (error) {
      this.onLoginError(error);
    }
  };

  onLoginSuccess = () => {
    this.loginSuccess = true;
    setTimeout(() => { this.router.navigate(['']); }, 300);
  };

  onLoginError = (error: any) => {
    this.requestPending = false;
    this.credsInvalid = (error.status === 401);
    throw new Error(error);
  };
}
