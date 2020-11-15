import { Component, OnInit, Input } from "@angular/core";
import { TicketService } from "../../../service/ticket.service";
import { Ticket } from "../../tickets/ticket";
import { User } from '../user';
import { Assignment } from '../../assignment';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AssignmentService } from 'src/app/service/assignment.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'user-assign',
  templateUrl: './user-assign.component.html',
  styleUrls: ['./user-assign.component.scss']
})
export class UserAssignComponent implements OnInit {
  @Input() user: User;
  public user$: Observable<User>;
  public allTickets: Ticket[];
  public availableTickets: Ticket[];
  public assignments: Assignment[];
  public addAssignmentsForm: FormGroup;
  public removeAssignmentsForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private assignmentService: AssignmentService,
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
    if (!this.user) {
      this.user$ = this.route.data.pipe(switchMap((data) => data.user)) as Observable<User>;
      this.user$.subscribe((user: User) => {
        this.user = new User({...user});
        this.populateAssignments();
      });
    } else {
      this.populateAssignments();
    }
  }

  onAddAssignments() {
    const ticketIdsToAdd: number[] = this.addAssignmentsForm.value.availableTicketsSelector;
    const ticketsToAdd = this.allTickets.filter(t => ticketIdsToAdd.indexOf(t.id) >= 0);

    ticketsToAdd.forEach(ticketToAdd => {
      // TODO: Remedy the switching between serializable and User objects
      const userInput = new User({
        ...this.user,
        assignedTickets: [
          ...this.user.assignments,
          ticketToAdd
        ]
      });
      this.assignmentService.create(userInput, ticketToAdd).subscribe({
        next: (assignments: Assignment[]) => {
          this.assignments.push(...assignments.map(a => new Assignment({
            id: a.id,
            user: this.user,
            ticket: this.allTickets.find(t => t.id === a.ticketId)
          })));
        }});
    });
    this.availableTickets = this.availableTickets.filter(t => ticketIdsToAdd.indexOf(t.id) < 0);
    this.addAssignmentsForm.reset();
    // TODO: new ticket appears for a second then disappears. this.availableTickets is getting restored to its prior state.
  }

  onRemoveAssignments() {
    const ticketIdsToRemove: number[] = this.removeAssignmentsForm.value.assignedTicketsSelector;
    const assignmentsToRemove = this.assignments.filter(a => ticketIdsToRemove.indexOf(a.ticket.id) >= 0);

    this.assignmentService.delete(assignmentsToRemove).subscribe({
      next: () => {
        this.assignments = this.assignments.filter(a => ticketIdsToRemove.indexOf(a.ticket.id) < 0);
      }
    });

    this.availableTickets = this.availableTickets.concat(assignmentsToRemove.map(a => a.ticket));
    this.removeAssignmentsForm.reset();
  }

  private populateAssignments() {
    this.ticketService.getTickets().subscribe(allTickets => {
      this.allTickets = allTickets;
      this.assignments = this.user.assignments.map(a => new Assignment({
        id: a.id,
        user: this.user,
        ticket: this.allTickets.find(t => t.id === a.ticket.id)
      }));
      this.availableTickets = allTickets.filter(t => !this.user.assignments.some(a => a.ticket.id === t.id));
    });
  }
}
