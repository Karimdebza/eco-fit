import { Sequelize, DataTypes } from 'sequelize';
import defineUser from '../../Model/User';

describe('User model', () => {
  let sequelize: Sequelize;
  let User: ReturnType<typeof defineUser>;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });
    User = defineUser(sequelize, DataTypes);
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('creer un utilisateur', async () => {
    const userData = {
      first_name: 'Alice',
      last_name: 'Smith',
      size: 170,
      height: 65,
      number_of_phone: '0601020304',
      password: 'hashed_pwd',
      age: 28,
      is_disabled: false,
      email: 'alice.smith@example.com',
      picture: 'alice.jpg',
      token: 'token123',
      disability_type: 'none',
      id_programme: null,
      id_adventure: null,
      id_partner: null,
      id_role: null,
    };

    const user = await User.create(userData);

    expect(user.id_user).toBeDefined();
    expect(user.first_name).toBe(userData.first_name);
    expect(user.last_name).toBe(userData.last_name);
    expect(user.size).toBe(userData.size);
    expect(user.height).toBe(userData.height);
    expect(user.number_of_phone).toBe(userData.number_of_phone);
    expect(user.password).toBe(userData.password);
    expect(user.age).toBe(userData.age);
    expect(user.is_disabled).toBe(userData.is_disabled);
    expect(user.email).toBe(userData.email);
    expect(user.picture).toBe(userData.picture);
    expect(user.token).toBe(userData.token);
    expect(user.disability_type).toBe(userData.disability_type);
    expect(user.id_programme).toBeNull();
    expect(user.id_adventure).toBeNull();
    expect(user.id_partner).toBeNull();
    expect(user.id_role).toBeNull();
  });
});