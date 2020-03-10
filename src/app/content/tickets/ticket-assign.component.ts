import { Component, OnInit } from "@angular/core";
import { TicketService } from "../../service/ticket.service";
import { ActivatedRoute, Params } from "@angular/router";
import { User } from "../users/user";
import { UserService } from "../../service/user.service";

@Component({
    selector: 'ticket-assign',
    templateUrl: './ticket-assign.component.html',
    styleUrls: ['./ticket-assign.component.css']
})
export class TicketAssignComponent implements OnInit {
    users: User[] = [];
    addedAssignmentIds: number[] = [];
    removedAssignmentIds: number[] = [];
    assignedIds: number[] = [];
    private ticketId: number;

    constructor(
        private ticketService: TicketService,
        private userService: UserService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.ticketId = +params['id'];
            this.userService.getUsers()
                .then(users => this.users = users);
            this.ticketService.getAssignments(this.ticketId)
                .subscribe(assigned => {
                    if (assigned) {
                        this.assignedIds = assigned.map(_assn => _assn.Id)
                    }
                });
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
            let removalIndex = this.removedAssignmentIds.findIndex(_removal => _removal === +_user.Id);
            if (removalIndex >= 0) {
                this.removedAssignmentIds.splice(this.removedAssignmentIds.indexOf(+_user.Id), 1);
            }
            let assignedIndex = this.assignedIds.findIndex(_assignedId => _assignedId === +_user.Id);
            if (assignedIndex < 0) {
                this.addedAssignmentIds.push(+_user.Id);
            }
        } else {
            // Remove assignment
            let additionIndex = this.addedAssignmentIds.findIndex(_addition => _addition === +_user.Id);
            if (additionIndex >= 0) {
                this.addedAssignmentIds.splice(this.addedAssignmentIds.indexOf(+_user.Id), 1);
            }
            let assignedIndex = this.assignedIds.findIndex(_assignedId => _assignedId === +_user.Id);
            if (assignedIndex >= 0) {
                this.removedAssignmentIds.push(+_user.Id);
            }
        }
    }

    assign(): void {
        this.ticketService.updateAssignments(this.ticketId, this.addedAssignmentIds, this.removedAssignmentIds)
            .subscribe(assigned => {
               this.assignedIds = assigned.map(assignee => assignee.Id);
            });
        this.assignedIds = [];
    }

    goBack(): void {
        window.history.back();
    }
}
