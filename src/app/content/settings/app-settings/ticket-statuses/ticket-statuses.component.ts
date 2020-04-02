import { Component, OnInit } from '@angular/core';
import { TicketStatus } from '../../../tickets/status';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TicketService } from 'src/app/service/ticket.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-ticket-statuses',
  templateUrl: './ticket-statuses.component.html',
  styleUrls: ['./ticket-statuses.component.scss']
})
export class TicketStatusesComponent implements OnInit {
  public ticketStatuses: TicketStatus[];
  public selectedTicketStatus: TicketStatus;
  public ticketStatusForm: FormGroup;

  constructor(
    private ticketService: TicketService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.ticketStatuses = [];
    this.ticketStatusForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.ticketService.getTicketStatuses().subscribe(statuses => {
      this.ticketStatuses = statuses;

      this.route.params.forEach((params: Params) => {
        const ticketStatusId = +params['id'];
        if (!ticketStatusId) return;

        this.selectedTicketStatus = this.ticketStatuses.find(c => c.id === +params['id']);
        this.ticketStatusForm.patchValue(this.selectedTicketStatus);
      });
    });
  }

  goBack(): void {
    window.history.back();
  }

  onTicketStatusSubmit() {
    const formVals = this.ticketStatusForm.value;
    if (this.selectedTicketStatus) {
      formVals.id = this.selectedTicketStatus.id;
      this.ticketService.updateTicketStatus(formVals)
        .subscribe(() => this.router.navigate(['/settings/app/ticket-statuses']));
    } else {
      this.ticketService.createTicketStatus(formVals)
      .subscribe(() => {
        this.ticketService.getTicketStatuses().subscribe(statuses => this.ticketStatuses = statuses);
        this.ticketStatusForm.reset();
      });
    }
  }

  onTicketStatusDelete() {
    alertify.confirm('Caution',
      'Are you sure you wish to delete this ticket status?',
      () => {
        this.ticketService.deleteTicketStatus(this.selectedTicketStatus)
          .subscribe(() => this.router.navigate(['/settings/app/ticket-statuses']));
      },
      null
    );
  }
}
