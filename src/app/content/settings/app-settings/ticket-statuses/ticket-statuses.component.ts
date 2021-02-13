import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { TicketStatus } from 'src/app/models/status';
import { FormItemField, TableFormInfo } from 'src/app/shared-content/table-form/table-form.component';
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
  public tableFormInfo: TableFormInfo<TicketStatus>;

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

    this.tableFormInfo = {
      linkPrefix: '/settings/app/ticket-statuses/',
      linkColumnName: 'name',
      service: this.service,
      formFields: itemFields,
    };
  }

  ngOnInit(): void {
    this.ticketStatusesData = this.service.getMany();
    this.ticketStatusesData.subscribe(items => {
      this.ticketStatuses = [];
      this.ticketStatuses.push(...items);
    });
  }

  /**
   * Child event for the table form component upon item selection.
   *
   * @param selectedItem The item for the row that was selected.
   */
  onItemSelected(selectedItem: TicketStatus) {
    this.selectedTicketStatus = selectedItem;
  }
}
