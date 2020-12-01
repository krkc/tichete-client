import { Component } from '@angular/core';
import { of, Observable } from 'rxjs';
import { User } from './user';

@Component({
  selector: 'user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent {
  public user$: Observable<User>;

  constructor(
  ) {
    this.user$ = of(new User());
  }
}
