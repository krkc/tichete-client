import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
  public user: User = new User();
  public userCreateForm: FormGroup;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userCreateForm = new FormGroup({
      username: new FormControl(),
      email: new FormControl(),
      firstName: new FormControl(),
      lastName: new FormControl(),
      password: new FormControl(),
    });
  }

  onSubmit() {
    const vals = this.userCreateForm.value;
    this.userService.create(vals as User).subscribe(newUser => this.user = newUser);
      this.router.navigate(['users']);
  }
}
