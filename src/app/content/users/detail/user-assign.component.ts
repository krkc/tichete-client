import { Component, OnInit, Input } from "@angular/core";
import { TicketService } from "../../../service/ticket.service";
import { Ticket } from "../../tickets/ticket";
import { User } from '../user';
import { Assignment } from '../../assignment';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/service/user.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'user-assign',
  templateUrl: './user-assign.component.html',
  styleUrls: ['./user-assign.component.scss']
})
export class UserAssignComponent implements OnInit {
  @Input() public user$: Observable<User>;
  public user: User;
  public allTickets: Ticket[];
  public availableTickets: Ticket[];
  public addAssignmentsForm: FormGroup;
  public removeAssignmentsForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private ticketService: TicketService,
    private fb: FormBuilder
  ) {
    this.addAssignmentsForm = this.fb.group({
      availableTicketsSelector: [],
    });
    this.removeAssignmentsForm = this.fb.group({
      assignedTicketsSelector: []
    });
  }

  ngOnInit(): void {
    if (!this.user$) {
      this.user$ = this.route.data.pipe(switchMap((data) => data.user)) as Observable<User>;
    }

    this.user$.subscribe((user: User) => {
      this.user = new User({...user});
      this.populateAssignments();
    });
  }

  onAddAssignments() {
    const ticketIdsToAdd: number[] = this.addAssignmentsForm.value.availableTicketsSelector;
    const ticketsToAdd = this.allTickets.filter(t => ticketIdsToAdd.indexOf(t.id) >= 0);

    const userInput = new User({
      ...this.user,
      assignments: this.user.assignments.concat(ticketsToAdd.map(t => new Assignment({ userId: this.user.id, ticketId: t.id }))),
    });
    this.userService.update(userInput).subscribe();

    this.availableTickets = this.availableTickets.filter(t => ticketIdsToAdd.indexOf(t.id) < 0);
    this.addAssignmentsForm.reset();
  }

  onRemoveAssignments() {
    const ticketIdsToRemove: number[] = this.removeAssignmentsForm.value.assignedTicketsSelector;
    const assignmentsToRemove = this.user.assignments.filter(a => ticketIdsToRemove.indexOf(a.ticket.id) >= 0);
    const ticketsToRemove = assignmentsToRemove.map(a => a.ticket);

    const userInput = new User({
      ...this.user,
      assignments: this.user.assignments.filter(a => ticketIdsToRemove.indexOf(a.ticket.id) < 0),
    });

    this.availableTickets = this.availableTickets.concat(ticketsToRemove);
    this.userService.update(userInput).subscribe();

    this.removeAssignmentsForm.reset();
  }

  private populateAssignments() {
    this.ticketService.getTicketsNoRels().subscribe(allTickets => {
      this.allTickets = allTickets;
      this.availableTickets = allTickets.filter(t => !this.user.assignments.some(a => a.ticket.id === t.id));
    });
  }
}
