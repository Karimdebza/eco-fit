// src/services/BaseService.ts
import { Model, ModelStatic, WhereOptions } from 'sequelize';

export default class BaseService<T extends Model> {
  constructor(protected model: ModelStatic<T>) {
    this.model = model;
  }

  findAll(where?: WhereOptions) {
    return this.model.findAll({ where });
  }

  findById(id: number) {
    // Assumes the primary key is 'id'; change as needed for your models
    return this.model.findOne({ where: { id } as WhereOptions });
  }

  create(data: Partial<T>) {
    return this.model.create(data as any);
  }

  async update(id: number, data: Partial<T>) {
    const item = await this.findById(id);
    if (!item) throw new Error('NotFound');
    return await item.update(data as any);
  }

  async delete(id: number) {
    const item = await this.findById(id);
    if (!item) throw new Error('NotFound');
    return await item.destroy();
  }
}
