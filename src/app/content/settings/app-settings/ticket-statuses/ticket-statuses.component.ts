import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { TicketStatus } from 'src/app/models/status';
import { FormItemField, ItemFormInfo } from 'src/app/content/table-form/table-form.component';
import { TicketStatusService } from 'src/app/service/ticket/ticket-status.service';

@Component({
  selector: 'app-ticket-statuses',
  templateUrl: './ticket-statuses.component.html',
  styleUrls: ['./ticket-statuses.component.scss']
})
export class TicketStatusesComponent implements OnInit {
  public ticketStatusesData: Observable<TicketStatus[]>;
  public ticketStatuses: TicketStatus[];
  public selectedTicketStatus: TicketStatus;
  public itemFormInfo: ItemFormInfo<TicketStatus>;

  constructor(
    private service: TicketStatusService,
    private route: ActivatedRoute
  ) {
    const itemFields: FormItemField[] = [
      {
        type: 'input',
        name: 'name',
        label: 'Name',
        required: true,
      },
      {
        type: 'input',
        name: 'description',
        label: 'Description',
        required: false,
      },
    ];

    this.itemFormInfo = {
      linkPrefix: '/settings/app/ticket-statuses/',
      linkColumnName: 'name',
      service: this.service,
      formFields: itemFields,
    };
  }

  ngOnInit(): void {
    this.ticketStatusesData = this.service.getMany();
    this.ticketStatusesData.subscribe(statuses => {
      this.ticketStatuses = [];
      this.ticketStatuses.push(...statuses);

      this.route.params.forEach((params: Params) => {
        const ticketStatusId = +params.id;
        if (!ticketStatusId) {return;}

        this.selectedTicketStatus = this.ticketStatuses.find(c => c.id === +params.id);
      });
    });
  }
}
