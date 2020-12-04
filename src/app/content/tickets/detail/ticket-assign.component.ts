import { Component, OnInit, Input } from "@angular/core";
import { User } from "../../users/user";
import { UserService } from "../../../service/user.service";
import { Ticket } from '../ticket';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Assignment } from '../../assignment';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TicketService } from 'src/app/service/ticket/ticket.service';

@Component({
  selector: 'ticket-assign',
  templateUrl: './ticket-assign.component.html',
  styleUrls: ['./ticket-assign.component.scss']
})
export class TicketAssignComponent implements OnInit {
  @Input() public ticket$: Observable<Ticket>;
  public ticket: Ticket;
  public allUsers: User[];
  public availableUsers: User[];
  public addAssignmentsForm: FormGroup;
  public removeAssignmentsForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.addAssignmentsForm = this.fb.group({
      availableUsersSelector: [],
    });
    this.removeAssignmentsForm = this.fb.group({
      assignedUsersSelector: []
    });
  }

  ngOnInit(): void {
    if (!this.ticket$) {
      this.ticket$ = this.route.data.pipe(switchMap((data) => data.ticket)) as Observable<Ticket>;
    }

    this.ticket$.subscribe((ticket: Ticket) => {
      this.ticket = new Ticket({...ticket, creator: new User({...ticket.creator})});
      this.populateAssignments();
    });
  }

  onAddAssignments() {
    const userIdsToAdd: number[] = this.addAssignmentsForm.value.availableUsersSelector;
    const usersToAdd = this.allUsers.filter(u => userIdsToAdd.indexOf(u.id) >= 0);

    const assignmentsToAdd = this.ticket.assignments || [];
    const ticketInput = new Ticket({
      ...this.ticket,
      assignments: assignmentsToAdd.concat(usersToAdd.map(u => new Assignment({ ticketId: this.ticket.id, userId: u.id }))),
    });
    this.ticketService.update(ticketInput).subscribe();

    this.availableUsers = this.availableUsers.filter(u => userIdsToAdd.indexOf(u.id) < 0);
    this.addAssignmentsForm.reset();
  }

  onRemoveAssignments() {
    const userIdsToRemove: number[] = this.removeAssignmentsForm.value.assignedUsersSelector;
    const assignmentsToRemove = this.ticket.assignments.filter(a => userIdsToRemove.indexOf(a.user.id) >= 0);
    const usersToRemove = assignmentsToRemove.map(a => a.user);

    const ticketInput = new Ticket({
      ...this.ticket,
      assignments: this.ticket.assignments.filter(a => userIdsToRemove.indexOf(a.user.id) < 0),
    });

    this.availableUsers = this.availableUsers.concat(usersToRemove);
    this.ticketService.update(ticketInput).subscribe();

    this.removeAssignmentsForm.reset();
  }

  private populateAssignments() {
    this.userService.getManyNoRels().subscribe(allUsers => {
      this.allUsers = allUsers;
      this.availableUsers = allUsers.filter(u => !this.ticket.assignments?.some(a => a.user.id === u.id));
    });
  }
}
