import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from 'src/app/models/role';
import { UserService } from 'src/app/service/user/user.service';
import { FormItemField, ItemFormInfo } from 'src/app/content/table-form/table-form.component';
import { RoleService } from 'src/app/service/user/role.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  public rolesData: Observable<Role[]>;
  public roles: Role[];
  public itemFormInfo: ItemFormInfo<Role>;
  public selectedRole: Role;

  constructor(
    private service: RoleService,
    private userService: UserService,
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

    this.itemFormInfo = {
      linkPrefix: '/settings/app/roles/',
      linkColumnName: 'name',
      service: this.service,
      formFields: itemFields,
    };
  }

  ngOnInit(): void {
    this.rolesData = this.userService.getRoles();
    this.rolesData.subscribe(roles => {
      this.roles = [];
      this.roles.push(...roles);

      this.route.params.forEach((params: Params) => {
        const roleId = +params['id'];
        if (!roleId) return;

        this.selectedRole = this.roles.find(r => r.id === +params['id']);
      });
    });
  }
}
