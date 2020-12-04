import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { User } from './user';
import { UserService } from '../../service/user.service';
import { Ticket } from "../tickets/ticket";
import * as alertify from "alertifyjs";
import { ApolloError } from '@apollo/client/core';

@Component({
    selector: 'my-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    public users$: Observable<User[]>;
    public selectedUser: User;
    public assignments: Ticket[];

    constructor(
      private router: Router,
      private userService: UserService
    ) { }

    ngOnInit(): void {
      this.users$ = this.userService.getMany();
    }

    onSelect(user: User): void {
      if (this.selectedUser === user) {
        this.selectedUser = null;
      } else {
        this.selectedUser = user;
      }
    }

    onDetail(): void {
      this.router.navigate(['/users/detail', this.selectedUser.id]);
    }

    onDelete(user: User): void {
        if (user.assignments?.length && user.assignments.length > 0) {
            alertify.confirm('Warning',
                'This user is assigned to one or more active tickets. ' +
                'Assignments must be removed before this user can be deleted. ' +
                'Would you like to remove assignments?',
                () => { this.router.navigate(['/users/assign', user.id]); },
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
            .delete([user])
            .subscribe({
              next: () => {
                if (this.selectedUser === user) {
                  this.selectedUser = null;
                }
              },
              error: (err: ApolloError) => {
                if (err.graphQLErrors[0]?.extensions?.exception?.code === 'ER_ROW_IS_REFERENCED_2') {
                  alertify.alert(
                    'Can Not Delete',
                    'There are relationships associated with this user.\n ' +
                    'Remove the relationships first and try again.');
                  return;
                }
              }
          });
    }
}
