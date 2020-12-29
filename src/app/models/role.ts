import { BaseModel } from './base-model';
import { Permission } from './permission';

export class Role extends BaseModel {
  name: string;
  description: string;
  isSystemAdmin: boolean;

  permissions?: Permission[];
}
