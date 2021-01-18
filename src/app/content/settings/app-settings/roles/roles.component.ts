import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as alertify from 'alertifyjs';
import { Role } from 'src/app/models/role';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  public rolesData: Observable<Role[]>;
  public roles: Role[];
  public selectedRole: Role;
  public roleForm: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.roles = [];
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.rolesData = this.userService.getRoles();
    this.rolesData.subscribe(roles => {
      this.roles.push(...roles);

      this.route.params.forEach((params: Params) => {
        const roleId = +params['id'];
        if (!roleId) return;

        this.selectedRole = this.roles.find(r => r.id === +params['id']);
        this.roleForm.patchValue(this.selectedRole);
      });
    });
  }

  goBack(): void {
    window.history.back();
  }

  onRoleSubmit() {
    const formVals = this.roleForm.value;
    if (this.selectedRole) {
      formVals.id = this.selectedRole.id;
      this.userService.updateRole(formVals)
        .subscribe(() => this.router.navigate(['/settings/app/roles']));
    } else {
      this.userService.createRole(formVals)
      .subscribe(() => {
        this.roleForm.reset();
      });
    }
  }

  onRoleDelete() {
    alertify.confirm('Caution',
      'Are you sure you wish to delete this role?',
      () => {
        this.userService.deleteRole([this.selectedRole])
          .subscribe(() => this.router.navigate(['/settings/app/roles']));
      },
      null
    );
  }
}
