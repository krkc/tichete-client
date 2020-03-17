import { Component, OnInit } from "@angular/core";
import { TicketService } from "../../service/ticket.service";
import { ActivatedRoute, Params } from "@angular/router";
import { UserService } from "../../service/user.service";
import { Ticket } from "../tickets/ticket";
import { TicketCategory } from "../tickets/category";
import { User } from './user';

@Component({
  selector: 'user-assign',
  templateUrl: './user-assign.component.html',
  styleUrls: ['./user-assign.component.css']
})
export class UserAssignComponent implements OnInit {
  tickets: Ticket[] = [];
  categories: TicketCategory[] = [];
  addedAssignmentIds: number[] = [];
  removedAssignmentIds: number[] = [];
  assignedIds: number[] = [];
  private user: User;

  constructor(
    private ticketService: TicketService,
    private userService: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      this.userService.getUser(+params['id']).subscribe(user => {
        this.userService.getAssignments(user)
          .then(_assigned => {
            if (_assigned) {
              this.assignedIds = _assigned.map(_assn => _assn.id)
            }
          });

        return this.user = user;
      });
    });

    this.ticketService.getCategories()
      .subscribe(_cat => {
        this.categories = _cat
        return this.ticketService.getTickets()
          .subscribe(_tickets => this.tickets = _tickets);
      });
  }

  getTicketCategory(_ticketId): string {
    return this.categories.find(c => c.id === +_ticketId).name || '';
  }

  isAssigned(_ticketId: string): boolean {
    if (this.assignedIds) {
      return this.assignedIds.some(_assigneeId => _assigneeId === +_ticketId);
    }
  }

  assignTo = (e: Event, _ticket: Ticket): void => {
    if ((<HTMLInputElement>e.target).checked) {
      // Add assignment
      const removalIndex = this.removedAssignmentIds.findIndex(_removal => _removal === +_ticket.id);
      if (removalIndex >= 0) {
        this.removedAssignmentIds.splice(this.removedAssignmentIds.indexOf(+_ticket.id), 1);
      }
      const assignedIndex = this.assignedIds.findIndex(_assignedId => _assignedId === +_ticket.id);
      if (assignedIndex < 0) {
        this.addedAssignmentIds.push(+_ticket.id);
      }
    } else {
      // Remove assignment
      const additionIndex = this.addedAssignmentIds.findIndex(_addition => _addition === +_ticket.id);
      if (additionIndex >= 0) {
        this.addedAssignmentIds.splice(this.addedAssignmentIds.indexOf(+_ticket.id), 1);
      }
      const assignedIndex = this.assignedIds.findIndex(_assignedId => _assignedId === +_ticket.id);
      if (assignedIndex >= 0) {
        this.removedAssignmentIds.push(+_ticket.id);
      }
    }
  }

  async assign(): Promise<void> {
    try {
      const assigned: Ticket[] = await this.userService.updateAssignments(
        this.user,
        this.addedAssignmentIds,
        this.removedAssignmentIds);
      this.assignedIds = assigned.map(_assignee => _assignee.id);
    } catch (err) {
      console.log(err);
      // this.assignedIds = [];
    }
  }

  goBack(): void {
    window.history.back();
  }
}
