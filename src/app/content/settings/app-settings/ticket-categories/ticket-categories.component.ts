import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketCategory } from '../../../../models/ticket-category';
import { FormItemField, TableFormInfo } from 'src/app/shared-content/table-form/table-form.component';
import { TicketCategoryService } from 'src/app/service/ticket/ticket-category.service';

@Component({
  selector: 'app-manage-ticket-categories',
  templateUrl: './ticket-categories.component.html',
  styleUrls: ['./ticket-categories.component.scss']
})
export class TicketCategoriesComponent implements OnInit {
  public ticketCategoriesData: Observable<TicketCategory[]>;
  public ticketCategories: TicketCategory[];
  public selectedTicketCategory: TicketCategory;
  public tableFormInfo: TableFormInfo<TicketCategory>;

  constructor(
    private service: TicketCategoryService,
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
      linkPrefix: '/settings/app/ticket-categories/',
      linkColumnName: 'name',
      service: this.service,
      formFields: itemFields,
    };
  }

  ngOnInit(): void {
    this.ticketCategoriesData = this.service.getMany();
    this.ticketCategoriesData.subscribe(items => {
      this.ticketCategories = [];
      this.ticketCategories.push(...items);
    });
  }

  /**
   * Child event for the table form component upon item selection.
   *
   * @param selectedItem The item for the row that was selected.
   */
  onItemSelected(selectedItem: TicketCategory) {
    this.selectedTicketCategory = selectedItem;
  }

}
