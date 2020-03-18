import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { User } from './user';
import { UserService } from '../../service/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'my-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  public user: User;
  public userUpdateForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    password: [''],
  });

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      let id = +params['id'];
      this.userService.getUser(id)
        .subscribe(user => {
          this.user = user
          this.userUpdateForm.setValue({
            username: this.user.username,
            email: this.user.email,
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            password: '',
          });
        });
    });
  };

  goBack(): void {
    window.history.back();
  }

  onSubmit() {
    const user = this.userUpdateForm.value;
    this.user.username = user.username;
    this.user.email = user.email;
    this.user.firstName = user.firstName;
    this.user.lastName = user.lastName;
    if (user.password) {
      this.user.password = user.password;
    }

    this.userService.update(this.user)
        .subscribe(this.goBack);
  }
}
