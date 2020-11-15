import { Component, OnInit, Input } from "@angular/core";
import { User } from "../../users/user";
import { UserService } from "../../../service/user.service";
import { Ticket } from '../ticket';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AssignmentService } from 'src/app/service/assignment.service';
import { Assignment } from '../../assignment';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'ticket-assign',
  templateUrl: './ticket-assign.component.html',
  styleUrls: ['./ticket-assign.component.scss']
})
export class TicketAssignComponent implements OnInit {
  @Input() ticket: Ticket;
  public ticket$: Observable<Ticket>;
  public allUsers: User[];
  public availableUsers: User[];
  public assignments: Assignment[];
  public addAssignmentsForm: FormGroup;
  public removeAssignmentsForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private assignmentService: AssignmentService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.addAssignmentsForm = this.fb.group({
      availableUsersSelector: [],
    });
    this.removeAssignmentsForm = this.fb.group({
      assigneesSelector: []
    });
  }

  ngOnInit(): void {
    if (!this.ticket) {
      this.ticket$ = this.route.data.pipe(switchMap((data) => data.ticket)) as Observable<Ticket>;
      this.ticket$.subscribe((ticket: Ticket) => {
        this.ticket = new Ticket({...ticket, creator: new User({...ticket.creator})});
        this.populateAssignments();
      });
    } else {
      this.populateAssignments();
    }
  }

  onAddAssignees() {
    const userIdsToAdd: number[] = this.addAssignmentsForm.value.availableUsersSelector;
    const usersToAdd = this.allUsers.filter(u => userIdsToAdd.indexOf(u.id) >= 0);

    usersToAdd.forEach(userToAdd => {
      this.assignmentService.create(userToAdd, this.ticket).subscribe({
        next: (assignments: Assignment[]) => {
          this.assignments.push(...assignments.map(a => new Assignment({
            id: a.id,
            ticket: this.ticket,
            user: this.allUsers.find(u => u.id === a.userId)
          })));
        }
      });
    });
    this.availableUsers = this.availableUsers.filter(u => userIdsToAdd.indexOf(u.id) < 0);
    this.addAssignmentsForm.reset();
  }

  onRemoveAssignees() {
    const userIdsToRemove: number[] = this.removeAssignmentsForm.value.assigneesSelector;
    const assignmentsToRemove = this.assignments.filter(a => userIdsToRemove.indexOf(a.user.id) >= 0);

    this.assignmentService.delete(assignmentsToRemove).subscribe({
      next: () => {
        this.assignments = this.assignments.filter(a => userIdsToRemove.indexOf(a.user.id) < 0);
      }
    });

    this.availableUsers = this.availableUsers.concat(assignmentsToRemove.map(a => a.user));
    this.removeAssignmentsForm.reset();
  }

  private populateAssignments() {
    this.userService.getUsers().subscribe(allUsers => {
      this.allUsers = allUsers;
      this.assignments = this.ticket.assignments.map(a => new Assignment({
        id: a.id,
        ticket: this.ticket,
        user: this.allUsers.find(u => u.id === a.user.id)
      }));
      this.availableUsers = allUsers.filter(u => !this.ticket.assignments.some(a => a.user.id === u.id));
    });
  }
}
