import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from 'src/app/models/role';
import { FormItemField, TableFormInfo } from 'src/app/content/table-form/table-form.component';
import { RoleService } from 'src/app/service/user/role.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  public rolesData: Observable<Role[]>;
  public roles: Role[];
  public tableFormInfo: TableFormInfo<Role>;
  public selectedRole: Role;

  constructor(
    private service: RoleService,
    private route: ActivatedRoute,
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
      {
        type: 'checkbox',
        name: 'isSystemAdmin',
        label: 'Is System Admin?',
        required: true,
      },
    ];

    this.tableFormInfo = {
      linkPrefix: '/settings/app/roles/',
      linkColumnName: 'name',
      service: this.service,
      formFields: itemFields,
    };
  }

  ngOnInit(): void {
    this.rolesData = this.service.getMany();
    this.rolesData.subscribe(items => {
      this.roles = [];
      this.roles.push(...items);
    });
  }

  /**
   * Child event for the table form component upon item selection.
   *
   * @param selectedItem The item for the row that was selected.
   */
  onItemSelected(selectedItem: Role) {
    this.selectedRole = selectedItem;
  }

}
