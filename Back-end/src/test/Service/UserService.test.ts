import { Sequelize, DataTypes } from 'sequelize';
import defineUser from '../../Model/User';
import { UserService } from '../../Service/UserService';
import { RoleService } from '../../Service/RoleService';
import bcrypt from 'bcrypt';

class TestUserService extends UserService {
  constructor(model: any, roleService: RoleService) {
    super(roleService);
    this.model = model;
  }
}

describe('UserService', () => {
  let sequelize: Sequelize;
  let User: ReturnType<typeof defineUser>;
  let roleService: RoleService;
  let userService: UserService;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });
    User = defineUser(sequelize, DataTypes);
    await sequelize.sync({ force: true });

    roleService = new RoleService();

    jest.spyOn(roleService, 'findDefaultRole').mockResolvedValue({ id_role: 1, libelle: 'user' });
    jest.spyOn(roleService, 'findByLibelle').mockImplementation(async (libelle) => {
      if (libelle === 'admin') return { id_role: 2, libelle: 'admin' };
      return null;
    });

    userService = new TestUserService(User, roleService);
    
    process.env.JWT_SECRET = 'test-jwt-secret-key-for-mvp-testing';
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('doit créer un nouvel utilisateur lors d une inscription', async () => {
    const signupData = {
      first_name: 'Test',
      last_name: 'User',
      email: 'testuser@example.com',
      password: 'password123',
      is_disabled: false,
      size: 170,
      height: 60,
      number_of_phone: '123456789',
      disability_type: 'none',
      picture: 'pic.jpg',
      token: '',
      id_programme: null,
      id_adventure: null,
      id_partner: null,
      id_role: null,
      age: 30,
    };

    const user = await userService.signup(signupData);

    expect(user.id_user).toBeDefined();
    expect(user.email).toBe(signupData.email);
    expect(user.id_role).toBe(1);
    expect(await bcrypt.compare(signupData.password, user.password)).toBe(true);
  });

  it('doit retourner une erreur si le mail existe deja lors d une inscription', async () => {
    await expect(userService.signup({
      first_name: 'Test2',
      last_name: 'User2',
      email: 'testuser@example.com',
      password: 'password123',
      is_disabled: false,
    })).rejects.toThrow('Utilisateur déjà existant');
  });

  it('doit mettre à jour le rôle d un utilisateur', async () => {
    const user = await userService.updateUserRole(1, 'admin');
    expect(user.id_role).toBe(2);
  });

  it('doit connecter un utilisateur avec des identifiants valides', async () => {
    const result = await userService.signin('testuser@example.com', 'password123');
    expect(result).toHaveProperty('token');
    expect(result.email).toBe('testuser@example.com');
  });

  it('doit refuser la connexion avec un mot de passe incorrect', async () => {
    await expect(userService.signin('testuser@example.com', 'wrongpassword'))
      .rejects.toThrow('Mot de passe incorrect');
  });

  it('doit mettre a jour la photo de profil', async () => {
    await userService.updateProfilePicture(1, 'newpic.jpg');
    const user = await userService.findById(1);
    expect(user!.picture).toBe('newpic.jpg');
  });

  it('doit invalider le token lors de la déconnexion', async () => {
    await userService.logout(1);
    const user = await userService.findById(1);
    expect(user!.token).toBeNull();
  });
});
