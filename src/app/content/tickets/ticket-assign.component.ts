import { Component, OnInit } from "@angular/core";
import { TicketService } from "../../service/ticket.service";
import { ActivatedRoute, Params } from "@angular/router";
import { User } from "../users/user";
import { UserService } from "../../service/user.service";
import { Ticket } from './ticket';

@Component({
    selector: 'ticket-assign',
    templateUrl: './ticket-assign.component.html',
    styleUrls: ['./ticket-assign.component.scss']
})
export class TicketAssignComponent implements OnInit {
    users: User[] = [];
    addedAssignmentIds: number[] = [];
    removedAssignmentIds: number[] = [];
    assignedIds: number[] = [];
    private ticket: Ticket;

    constructor(
        private ticketService: TicketService,
        private userService: UserService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            const ticketId = +params['id'];
            this.ticketService.getTicket(ticketId).subscribe((ticket) => {
              this.ticket = ticket;
              this.ticketService.getAssignedUsers(this.ticket)
                .subscribe(assigned => {
                    if (assigned) {
                        this.assignedIds = assigned.map(_assn => _assn.id)
                    }
                });
            });

            this.userService.getUsers()
                .subscribe(users => this.users = users);
        });
    }

    isAssigned(_userId: string): boolean {
        if (this.assignedIds) {
            return this.assignedIds.some(_assigneeId => _assigneeId === +_userId);
        }
    }

    assignTo(e: Event, _user: User): void {
        if ((<HTMLInputElement>e.target).checked) {
            // Add assignment
            let removalIndex = this.removedAssignmentIds.findIndex(_removal => _removal === +_user.id);
            if (removalIndex >= 0) {
                this.removedAssignmentIds.splice(this.removedAssignmentIds.indexOf(+_user.id), 1);
            }
            let assignedIndex = this.assignedIds.findIndex(_assignedId => _assignedId === +_user.id);
            if (assignedIndex < 0) {
                this.addedAssignmentIds.push(+_user.id);
            }
        } else {
            // Remove assignment
            let additionIndex = this.addedAssignmentIds.findIndex(_addition => _addition === +_user.id);
            if (additionIndex >= 0) {
                this.addedAssignmentIds.splice(this.addedAssignmentIds.indexOf(+_user.id), 1);
            }
            let assignedIndex = this.assignedIds.findIndex(_assignedId => _assignedId === +_user.id);
            if (assignedIndex >= 0) {
                this.removedAssignmentIds.push(+_user.id);
            }
        }
    }

    assign(): void {
        this.ticketService.updateAssignments(this.ticket.id, this.addedAssignmentIds, this.removedAssignmentIds)
            .subscribe(assigned => {
               this.assignedIds = assigned.map(assignee => assignee.id);
            });
        this.assignedIds = [];
    }

    goBack(): void {
        window.history.back();
    }
}
