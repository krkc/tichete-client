import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as alertify from 'alertifyjs';
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
  public permissionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private permissionService: PermissionService,
  ) {
    this.permissionForm = this.fb.group({
      resourceName: ['', Validators.required],
      creatorOnly: [null, Validators.required],
      operationIds: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.role = this.role || new Role({permissions: []});
  }

  goBack(): void {
    window.history.back();
  }

  onPermissionSubmit(): void {
    const formVals = this.permissionForm.value;
    const permissionInput = new Permission({
      resourceName: formVals['resourceName'],
      creatorOnly: !!formVals['creatorOnly'],
      roleId: this.role.id
    });
    formVals['operationIds'].forEach((id: string) => {
      permissionInput[id] = true;
    });
    if (this.selectedPermission) {
      permissionInput.id = this.selectedPermission.id;
      this.permissionService.update(permissionInput)
        .subscribe(() => this.router.navigate(['/settings/app/roles']));
    } else {
      this.permissionService.create(permissionInput)
      .subscribe(() => {
        this.permissionForm.reset();
      });
    }
  }
// TODO: Genericize table form
  onPermissionDelete(): void {
    alertify.confirm('Caution',
    'Are you sure you wish to delete this permission?',
    () => {
      this.permissionService.delete([this.selectedPermission])
        .subscribe(() => this.router.navigate(['/settings/app/roles']));
    },
    null
  );
  }

}
