import { Component, OnInit, Input } from "@angular/core";
import { TicketService } from "../../../service/ticket.service";
import { Ticket } from "../../tickets/ticket";
import { User } from '../user';
import { Assignment } from '../../assignment';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AssignmentService } from 'src/app/service/assignment.service';

@Component({
  selector: 'user-assign',
  templateUrl: './user-assign.component.html',
  styleUrls: ['./user-assign.component.scss']
})
export class UserAssignComponent implements OnInit {
  @Input() user: User;
  public allTickets: Ticket[];
  public availableTickets: Ticket[];
  public assignedTickets: Ticket[];
  public addAssignmentsForm: FormGroup;
  public removeAssignmentsForm: FormGroup;

  constructor(
    private assignmentService: AssignmentService,
    private ticketService: TicketService,
    private fb: FormBuilder
  ) {
    this.addAssignmentsForm = this.fb.group({
      allTicketsSelector: [],
    });
    this.removeAssignmentsForm = this.fb.group({
      assignmentsSelector: []
    });
  }

  ngOnInit(): void {
    this.ticketService.getTickets().subscribe(allTickets => {
      this.allTickets = allTickets;
      this.assignedTickets = allTickets.filter(t => this.user.assignments.some(a => a.ticketId === t.id));
      this.availableTickets = allTickets.filter(t => !this.assignedTickets.some(at => at.id === t.id));
    });
  }

  onAddAssignments() {
    const ticketIdsToAdd: number[] = this.addAssignmentsForm.value.allTicketsSelector;
    const ticketsToAdd = this.allTickets.filter(t => ticketIdsToAdd.indexOf(t.id) >= 0);
    ticketsToAdd.forEach(ticketToAdd => {
      const userInput = new User({
        ...this.user,
        assignedTickets: [
          ...this.user.assignments,
          ticketToAdd
        ]
      });
      this.assignmentService.create(userInput, ticketToAdd).subscribe(() => {
        // this.assignmentService.getAssignments({ user: this.user }).subscribe(assignments => {
        //   assignments.map(a => {
        //     a.user = this.user;
        //     a.ticket = this.allTickets.find(t => t.id === a.ticketId);
        //   });
        //   this.assignments = assignments;
        // });
      });
    });
    this.availableTickets = this.availableTickets.filter(t => ticketIdsToAdd.indexOf(t.id) < 0);
    this.addAssignmentsForm.reset();
  }

  onRemoveAssignments() {
    const assignmentIdsToRemove: number[] = this.removeAssignmentsForm.value.assignmentsSelector;
    const assignmentsToRemove = assignmentIdsToRemove.map(id => new Assignment({id}));
    // const assignmentsToRemove = this.assignments.filter(a => assignmentIdsToRemove.indexOf(a.id) >= 0);
    // this.availableTickets = this.availableTickets.concat(assignmentsToRemove.map(a => a.ticket));
    assignmentsToRemove.forEach(assignmentToRemove => {
      this.assignmentService.delete(assignmentToRemove).subscribe(() => {
        // this.assignments = this.assignments.filter(a => assignmentIdsToRemove.indexOf(a.id) < 0);
      });
    });
    this.removeAssignmentsForm.reset();
  }
}
