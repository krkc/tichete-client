import { Component } from '@angular/core';
import { User } from './user';

@Component({
  selector: 'user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent {
  public user: User;

  constructor(
  ) {
    this.user = new User();
  }
}
