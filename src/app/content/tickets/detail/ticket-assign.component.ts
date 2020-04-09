import { Component, OnInit, Input } from "@angular/core";
import { User } from "../../users/user";
import { UserService } from "../../../service/user.service";
import { Ticket } from '../ticket';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AssignmentService } from 'src/app/service/assignment.service';
import { Assignment } from '../../assignment';

@Component({
  selector: 'ticket-assign',
  templateUrl: './ticket-assign.component.html',
  styleUrls: ['./ticket-assign.component.scss']
})
export class TicketAssignComponent implements OnInit {
  @Input() ticket: Ticket;
  public allUsers: User[];
  public availableUsers: User[];
  public assignments: Assignment[];
  public addAssignmentsForm: FormGroup;
  public removeAssignmentsForm: FormGroup;

  constructor(
    private assignmentService: AssignmentService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.addAssignmentsForm = this.fb.group({
      allUsersSelector: [],
    });
    this.removeAssignmentsForm = this.fb.group({
      assigneesSelector: []
    });
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(allUsers => {
      this.allUsers = allUsers;
      this.assignmentService.getAssignments({ ticket: this.ticket }).subscribe(assignments => {
        assignments.map(a => {
          a.ticket = this.ticket;
          a.user = allUsers.find(u => u.id === a.userId);
        });
        this.assignments = assignments;
        this.availableUsers = allUsers.filter(u => !assignments.some(a => a.userId === u.id));
      });
    });
  }

  onAddAssignees() {
    const userIdsToAdd: number[] = this.addAssignmentsForm.value.allUsersSelector;
    const usersToAdd = this.allUsers.filter(u => userIdsToAdd.indexOf(u.id) >= 0);
    usersToAdd.forEach(userToAdd => {
      this.assignmentService.create(userToAdd, this.ticket).subscribe(() => {
        this.assignmentService.getAssignments({ ticket: this.ticket }).subscribe(assignments => {
          assignments.map(a => {
            a.ticket = this.ticket;
            a.user = this.allUsers.find(u => u.id === a.userId);
          });
          this.assignments = assignments;
        });
      });
    });
    this.availableUsers = this.availableUsers.filter(u => userIdsToAdd.indexOf(u.id) < 0);
    this.addAssignmentsForm.reset();
  }

  onRemoveAssignees() {
    const assignmentIdsToRemove: number[] = this.removeAssignmentsForm.value.assigneesSelector;
    const assignmentsToRemove = this.assignments.filter(a => assignmentIdsToRemove.indexOf(a.id) >= 0);
    this.availableUsers = this.availableUsers.concat(assignmentsToRemove.map(a => a.user));
    assignmentsToRemove.forEach(assignmentToRemove => {
      this.assignmentService.delete(assignmentToRemove).subscribe(() => {
        this.assignments = this.assignments.filter(a => assignmentIdsToRemove.indexOf(a.id) < 0);
      });
    });
    this.removeAssignmentsForm.reset();
  }
}
