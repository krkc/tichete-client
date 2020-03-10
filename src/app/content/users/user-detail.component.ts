import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { User } from './user';
import { UserService } from '../../service/user.service';

@Component({
    selector: 'my-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
    public user: User;

    constructor(
        private userService: UserService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id = +params['id'];
            this.userService.getUser(id)
                .then(_user => this.user = _user);
        });
    }

    goBack(): void {
        window.history.back();
    }

    save(_username: string): void {
        this.userService.update(this.user)
            .then(this.goBack);
    }
}
