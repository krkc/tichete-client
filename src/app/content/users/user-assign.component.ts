import { Component, OnInit } from "@angular/core";
import { TicketService } from "../../service/ticket.service";
import { ActivatedRoute, Params } from "@angular/router";
import { UserService } from "../../service/user.service";
import {Ticket} from "../tickets/ticket";
import {TCategory} from "../tickets/category";

@Component({
    selector: 'user-assign',
    templateUrl: './user-assign.component.html',
    styleUrls: ['./user-assign.component.css']
})
export class UserAssignComponent implements OnInit {
    tickets: Ticket[] = [];
    categories: TCategory[] = [];
    addedAssignmentIds: number[] = [];
    removedAssignmentIds: number[] = [];
    assignedIds: number[] = [];
    private userId: number;

    constructor(
        private ticketService: TicketService,
        private userService: UserService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.userId = +params['id'];
            this.ticketService.getCategories()
                .subscribe(_cat => {
                    this.categories = _cat
                    return this.ticketService.getTickets()
                        .subscribe(_tickets => this.tickets = _tickets);
                });
            this.userService.getAssignments(this.userId)
                .then(_assigned => {
                    if (_assigned) {
                        this.assignedIds = _assigned.map(_assn => _assn.Id)
                    }
                });
        });
    }

    getTicketCategory(_ticketId): string {
      return this.categories.find(c => c.Id === +_ticketId).Name || '';
    }

    isAssigned(_ticketId: string): boolean {
      if (this.assignedIds) {
          return this.assignedIds.some(_assigneeId => _assigneeId === +_ticketId);
      }
    }

    assignTo(e: Event, _ticket: Ticket): void {
      if ((<HTMLInputElement>e.target).checked) {
        // Add assignment
        const removalIndex = this.removedAssignmentIds.findIndex(_removal => _removal === +_ticket.Id);
        if (removalIndex >= 0) {
            this.removedAssignmentIds.splice(this.removedAssignmentIds.indexOf(+_ticket.Id), 1);
        }
        const assignedIndex = this.assignedIds.findIndex(_assignedId => _assignedId === +_ticket.Id);
        if (assignedIndex < 0) {
            this.addedAssignmentIds.push(+_ticket.Id);
        }
      } else {
        // Remove assignment
        const additionIndex = this.addedAssignmentIds.findIndex(_addition => _addition === +_ticket.Id);
        if (additionIndex >= 0) {
            this.addedAssignmentIds.splice(this.addedAssignmentIds.indexOf(+_ticket.Id), 1);
        }
        const assignedIndex = this.assignedIds.findIndex(_assignedId => _assignedId === +_ticket.Id);
        if (assignedIndex >= 0) {
            this.removedAssignmentIds.push(+_ticket.Id);
        }
      }
    }

    async assign(): Promise<void> {
      try {
        const assigned: Ticket[] = await this.userService.updateAssignments(
          this.userId,
          this.addedAssignmentIds,
          this.removedAssignmentIds);
        this.assignedIds = assigned.map(_assignee => _assignee.Id);
      } catch (err) {
        console.log(err);
        // this.assignedIds = [];
      }
    }

    goBack(): void {
        window.history.back();
    }
}
