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
    public user: User = new User();

    constructor(
        private router: Router,
        private userService: UserService
    ) { }

    ngOnInit() {
    }

    async add(): Promise<void> {
      this.user = await this.userService.create(this.user);
      this.router.navigate(['users']);
    }
}
