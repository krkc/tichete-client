import { BaseModel } from './base-model';
import { Role } from './role';

export class Permission extends BaseModel {
  resourceName: string;
  creatorOnly: boolean;

  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;

  roleId: number;
  role: Role;
}
