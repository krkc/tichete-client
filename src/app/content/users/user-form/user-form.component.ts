import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators,  } from '@angular/forms';
import { Observable } from 'rxjs';
import { Role } from 'src/app/models/role';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @Input() user$: Observable<User>;
  public user: User;
  public roles: Role[];
  public userForm: FormGroup;
  public isResetPassword: boolean = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      roleId: ['', ],
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

        if (this.user?.id) {
          this.populateFormFields();
        } else {
          this.isResetPassword = true;
          this.userForm.controls.password[this.isResetPassword ? 'enable' : 'disable']();
        }
      },
    });

    this.userService.getRoles().subscribe((roles: Role[]) => {
      this.roles = roles;
    });
  }

  goBack(): void {
    window.history.back();
  }

  onUserSubmit() {
    const formVals = this.userForm.value;
    const userData = new User({
      ...formVals,
      role: this.roles.find(role => role.id === formVals.roleId) || undefined,
    });
    console.log(userData);


    let submitResult: Observable<any>;
    if (this.user.id) {
      // Update
      userData.id = this.user.id;
      submitResult = this.userService.update(userData);
    } else {
      // Create
      submitResult = this.userService.create(userData);
    }

    submitResult.subscribe((updatedResource) => {
      if (updatedResource.length > 0) return this.goBack();

      throw new Error(`User ${this.user.id ? 'Create': 'Update'} failed`);
    });
  }

  private populateFormFields() {
    this.userForm.setValue({
      roleId: this.user.role?.id || '',
      email: this.user.email,
      username: this.user.username,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      password: this.user.password || '',
    });
  }
}
