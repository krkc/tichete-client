import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/service/user.service';
import { User } from '../user';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @Input() user$: Observable<User>;
  public user: User;
  public userForm: FormGroup;
  public isResetPassword: boolean = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: [{
        value: null,
        disabled: !this.isResetPassword
      }],
    });
  }

  ngOnInit(): void {
    this.user$.subscribe({
      next: (user: User) => {
        this.user = new User({ ...user });
        this.populateFormFields();
      },
      error: () => {
        // 'Create' form
        this.isResetPassword = true;
        this.userForm.controls.password[this.isResetPassword ? 'enable' : 'disable']();
        return
      }
    });
  }

  goBack(): void {
    window.history.back();
  }

  onUserSubmit() {
    const formVals = this.userForm.value;
    const userData = new User({
      ...formVals
    });

    if (this.user.id) {
      userData.id = this.user.id;
      this.userService.update(userData)
      .subscribe((updatedUser) => {
        if (updatedUser.length > 0) return this.goBack();

        console.log('user-form.update', updatedUser);
      });
    } else {
      this.userService.create(userData)
      .subscribe((createdUser) => {
        if (createdUser.length > 0) return this.goBack();

        console.log('user-form.create', createdUser);
      });
    }
  }

  private populateFormFields() {
    this.userForm.setValue({
      email: this.user.email,
      username: this.user.username,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      password: this.user.password || '',
    });
  }
}
