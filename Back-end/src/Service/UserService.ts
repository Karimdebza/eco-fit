import db from '../Model'
import { Op } from 'sequelize'
import BaseService from './BaseService'
import {RoleService} from './RoleService'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class UserService extends BaseService<typeof db.User> {
  constructor(private roleService: RoleService) {
    super(db.User)
  }

  async findByEmail(email: string) {
    return this.model.findOne({ where: { email } })
  }

  async searchByName(name: string) {
    return this.model.findAll({
      where: {
        [Op.or]: [
          { first_name: { [Op.like]: `%${name}%` } },
          { last_name: { [Op.like]: `%${name}%` } },
        ],
      },
    })
  }
  async findById(id: number) {
  return this.model.findOne({ where: { id_user: id } });
}

  async countUsers() {
    return this.model.count()
  }

  async toggleUserDisabled(id_user: number, is_disabled: boolean) {
    const user = await this.findById(id_user)
    if (!user) throw new Error('Utilisateur non trouvé')
    return user.update({ is_disabled })
  }

  async updatePassword(id_user: number, newPassword: string) {
    const user = await this.findById(id_user)
    if (!user) throw new Error('Utilisateur non trouvé')
    // Fix: password must always be hashed before storage
    const hashed = await bcrypt.hash(newPassword, 10)
    return user.update({ password: hashed })
  }

  async updateProfilePicture(id_user: number, pictureUrl: string) {
    const user = await this.findById(id_user)
    if (!user) throw new Error('Utilisateur non trouvé')
    return user.update({ picture: pictureUrl })
  }

  async signup(data: any) {
    const existing = await this.findByEmail(data.email)
    if (existing) throw new Error('Utilisateur déjà existant')
    const role = await this.roleService.findDefaultRole()
    console.log(role.id_role)
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const user = await this.create({ ...data, password: hashedPassword, id_role: role.id_role })

    return user
  }

  async signin(email: string, password: string) {
    const user = await this.findByEmail(email)
    if (!user) throw new Error('Utilisateur non trouvé')
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) throw new Error('Mot de passe incorrect')
 const token = jwt.sign({ id: user.id_user }, process.env.JWT_SECRET!, { expiresIn: '1d' });
console.log("Token généré pour l'user :", user.id_user);
      await this.updateToken(user.id_user, token);
       return { id: user.id_user, email: user.email, token };

  }

  async getUserById(id: number)  {
    const user = await this.model.findOne({ 
    where: { id_user: id },
    raw: true
  });
  
   return user;
    
  }

  async updateToken(userId: number, token: string) {
    const user = await this.findById(userId)
    if (!user) throw new Error('Utilisateur non trouvé')
    await user.update({ token: token });
    return user
  }
  

async logout(userId: number): Promise<void> {
  const user = await this.findById(userId);
  if (!user) throw new Error('Utilisateur non trouvé');
  
  // Invalider le token
  await user.update({ token: null });
}
  async updateUserRole(userId: number, newRoleLabel: string) {
    const role = await this.roleService.findByLibelle(newRoleLabel)
    if (!role) throw new Error('Rôle non trouvé')

    const user = await this.model.findByPk(userId)
    if (!user) throw new Error('Utilisateur non trouvé')

    user.id_role = role.id_role
    await user.save()

    return user
  }
}

export const userService = new UserService(new RoleService())