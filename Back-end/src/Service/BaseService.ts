// src/services/BaseService.ts
import { Model, ModelStatic, WhereOptions } from 'sequelize';

/**
 * BaseService générique.
 * 
 * IMPORTANT : Sequelize ne connaît pas le nom de la PK à l'instanciation.
 * Les sous-classes DOIVENT override findById si leur PK n'est pas 'id'.
 * Ex: UserService override avec { id_user: id }, RoleService avec { id_role: id }.
 * 
 * findByPk() de Sequelize utilise la PK déclarée dans le model — c'est la méthode
 * correcte à utiliser ici pour éviter ce problème.
 */
export default class BaseService<T extends Model> {
  constructor(protected model: ModelStatic<T>) {}

  findAll(where?: WhereOptions) {
    return this.model.findAll({ where });
  }

  // Utilise findByPk qui respecte la PK déclarée dans le model
  findById(id: number) {
    return this.model.findByPk(id);
  }

  create(data: Partial<T['_creationAttributes']>) {
    return this.model.create(data as any);
  }

  async update(id: number, data: Partial<T['_creationAttributes']>) {
    const item = await this.findById(id);
    if (!item) throw new Error('NotFound');
    return item.update(data as any);
  }

  async delete(id: number) {
    const item = await this.findById(id);
    if (!item) throw new Error('NotFound');
    return item.destroy();
  }
}