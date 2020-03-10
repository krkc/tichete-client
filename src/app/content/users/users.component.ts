import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './user';
import { UserService } from '../../service/user.service';
import { Ticket } from "../tickets/ticket";
import * as alertify from "alertifyjs";

@Component({
    selector: 'my-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
    public users: User[];
    public selectedUser: User;
    public assignments: Ticket[];

    constructor(
        private router: Router,
        private userService: UserService) { }

    getUsers(): void {
        this.userService.getUsers().then(users => this.users = users);
    }

    ngOnInit(): void {
        this.getUsers();
    }

    onSelect(user: User): void {
        if (this.selectedUser === user) {
            this.selectedUser = null;
        }
        else {
            this.selectedUser = user;
        }

        this.userService
            .getAssignments(user.Id)
            .then((_assignedTickets: Ticket[]) => {
                this.assignments = _assignedTickets;
            });
    }

    onAssign(): void {
        this.router.navigate(['/user/assign', this.selectedUser.Id])
    }

    onEdit(): void {
        this.router.navigate(['/user/detail', this.selectedUser.Id]);
    }

    onDelete(user: User): void {
        if (this.assignments && this.assignments.length > 0) {
            alertify.confirm('Warning',
                'This user is assigned to one or more active tickets.' +
                'Assignments must be removed before this user can be deleted.' +
                'Would you like to remove assignments?',
                () => { this.router.navigate(['/user/assign', user.Id]); },
                null
            );
            return;
        }

        alertify.confirm('Caution',
            'Are you sure you wish to delete this ticket?',
            () => { this.deleteUser(user); },
            null
        );
    }

    private deleteUser(user: User): void {
        this.userService
            .delete(user.Id)
            .then((err: any) => {
                if (err) {
                    alertify.alert('Error', `Error ${err.errno}: ${err.code}`);
                    return;
                }

                this.users = this.users.filter(u => u !== user);
                if (this.selectedUser === user) { this.selectedUser = null; }
            });
    }
}
