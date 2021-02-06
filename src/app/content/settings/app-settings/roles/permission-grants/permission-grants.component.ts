import { Component, Input, OnInit } from '@angular/core';
import { FormItemField, ItemFormInfo } from 'src/app/content/table-form/table-form.component';
import { BaseModel } from 'src/app/models/base-model';
import { Permission } from 'src/app/models/permission';
import { Role } from 'src/app/models/role';
import { PermissionService } from 'src/app/service/user/permission.service';

@Component({
  selector: 'app-permission-grants',
  templateUrl: './permission-grants.component.html',
  styleUrls: ['./permission-grants.component.scss']
})
export class PermissionGrantsComponent implements OnInit {
  @Input() role: Role;
  public permissions: Permission[];
  public selectedPermission = null;
  public itemFormInfo: ItemFormInfo<Permission>;

  constructor(
    private service: PermissionService,
  ) {
    const itemFields: FormItemField[] = [
      {
        type: 'select',
        name: 'resourceName',
        label: 'Resource',
        options: [
          { label: 'Users', value: 'users' },
          { label: 'Roles', value: 'roles' },
          { label: 'Tickets', value: 'tickets' },
          { label: 'Ticket Statuses', value: 'ticketStatuses' },
          { label: 'Ticket Categories', value: 'ticketCategories' },
        ],
        required: true,
      },
      {
        type: 'select',
        name: 'creatorOnly',
        label: 'Scope',
        options: [
          { label: 'Creator Only', value: true },
          { label: 'Everyone', value: false },
        ],
        required: true,
      },
      {
        type: 'select',
        name: 'permissions',
        label: 'Permitted Operations',
        options: [
          { label: 'Create', value: 'canCreate' },
          { label: 'Read', value: 'canRead' },
          { label: 'Update', value: 'canUpdate' },
          { label: 'Delete', value: 'canDelete' },
        ],
        multiple: true,
        required: true,
        fieldValMapFn: (item, fieldValue) => {
          fieldValue.forEach((v: any) => {
            item[v] = true;
          });
          return item;
        },
      },
      {
        type: 'hidden',
        name: 'roleId',
        label: 'Role Id',
        required: true,
        fieldValMapFn: (item) => {
          // eslint-disable-next-line @typescript-eslint/dot-notation
          item['roleId'] = this.role.id;
          return item;
        },
      }
    ];

    this.itemFormInfo = {
      service: this.service,
      linkColumnName: 'resourceName',
      formFields: itemFields,
    };
  }

  ngOnInit(): void {
    this.role = this.role || new Role({permissions: []});
  }

}
