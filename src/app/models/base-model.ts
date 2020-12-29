export abstract class BaseModel<T extends BaseModel = any> {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<T> = {}) {
    Object.assign(this, partial);
  }
}
