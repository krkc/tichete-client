import { Component, OnInit, Input } from '@angular/core';
import { User } from '../user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @Input() user: User;
  public userForm: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (!this.user.id) return;

    this.userForm.setValue({
      email: this.user.email,
      username: this.user.username,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      password: this.user.password || '',
    });
  }

  goBack(): void {
    window.history.back();
  }

  onUserSubmit() {
    const formVals = this.userForm.value;
    this.user.email = formVals.email;
    this.user.username = formVals.username;
    this.user.firstName = formVals.firstName;
    this.user.lastName = formVals.lastName;
    this.user.password = formVals.password;
    if (this.user.id) {
      this.userService.update(this.user)
        .subscribe(this.goBack);
    } else {
      this.userService.create(this.user)
        .subscribe(this.goBack);
    }
  }
}
