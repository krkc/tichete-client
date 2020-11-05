export abstract class Base {
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
