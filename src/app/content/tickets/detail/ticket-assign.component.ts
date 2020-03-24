import { Component, OnInit } from "@angular/core";
import { TicketService } from "../../../service/ticket.service";
import { ActivatedRoute, Params } from "@angular/router";
import { User } from "../../users/user";
import { UserService } from "../../../service/user.service";
import { Ticket } from '../ticket';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'ticket-assign',
  templateUrl: './ticket-assign.component.html',
  styleUrls: ['./ticket-assign.component.scss']
})
export class TicketAssignComponent implements OnInit {
  public ticket: Ticket;
  public assignedUsers: User[];
  public users: User[];
  public addAssignmentsForm: FormGroup;
  public removeAssignmentsForm: FormGroup;

  constructor(
    private ticketService: TicketService,
    private userService: UserService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.ticket = null;
    this.addAssignmentsForm = this.fb.group({
      allUsersSelector: [this.users],
    });
    this.removeAssignmentsForm = this.fb.group({
      assigneesSelector: []
    });
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      const ticketId = +params['id'];
      this.ticketService.getTicket(ticketId).subscribe((ticket) => {
        this.ticket = ticket;
        this.ticketService.getAssignedUsers(this.ticket)
          .subscribe(assignedUsers => {
            this.ticket.assignedUsers = assignedUsers;
          });
      });

      this.userService.getUsers()
        .subscribe(users => {
          this.users = users;
        });
    });
  }

  onAddAssignees() {
    const userIdsToAdd: number[] = this.addAssignmentsForm.value.allUsersSelector;
    this.ticket.assignedUsers = this.ticket.assignedUsers.concat(this.users.filter((u) => userIdsToAdd.indexOf(u.id) >= 0));
    this.users = this.users.filter((u) => userIdsToAdd.indexOf(u.id) < 0);
    this.addAssignmentsForm.reset();
    this.ticketService.addAssignments(this.ticket, userIdsToAdd);
  }

  onRemoveAssignees() {
    const userIdsToRemove: number[] = this.removeAssignmentsForm.value.assigneesSelector;
    this.users = this.users.concat(this.ticket.assignedUsers.filter((u) => userIdsToRemove.indexOf(u.id) >= 0));
    this.ticket.assignedUsers = this.ticket.assignedUsers.filter((u) => userIdsToRemove.indexOf(u.id) < 0);
    this.removeAssignmentsForm.reset();
    this.ticketService.removeAssignments(this.ticket, userIdsToRemove);
  }
}
