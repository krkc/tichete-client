export abstract class BaseModel {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data?: any) {
    if (!data) return;

    for (let key in data) {
        this[key] = data[key];
    }
  }
}
