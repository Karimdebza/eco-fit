import  db  from '../Model';
import BaseService from './BaseService';
 
export  class  RoleService extends BaseService<typeof db.Role> {
  constructor() {
    super(db.Role);
  }

    async findByLibelle(libelle: string) {
        return this.model.findOne({ where: { libelle } });
    }
    async findDefaultRole() {
  const role = await db.Role.findOne({ where: { libelle: 'user' } });
  if (!role) throw new Error('Rôle par défaut non trouvé');
  return role;
}
}

export const roleService = new RoleService();