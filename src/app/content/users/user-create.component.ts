import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';

@Component({
    selector: 'user-create',
    templateUrl: './user-create.component.html',
    styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
    public user: User;

    constructor(
        private router: Router,
        private userService: UserService
    ) {

    }

    ngOnInit() {
    }

    async add(_username: string, _firstname: string, _lastname: string, _password): Promise<void> {
      this.user = await this.userService.create(_username, _firstname, _lastname, _password);
      this.router.navigate(['users']);
    }
}
