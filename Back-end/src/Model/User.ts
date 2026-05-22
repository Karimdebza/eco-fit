// userModel.ts
import { Sequelize, DataTypes as DT, Model } from 'sequelize';

export default (sequelize: Sequelize, DataTypes: typeof DT) => {
  class User extends Model {
    declare id_user: number;
    declare first_name: string;
    declare last_name: string;
    declare size: number;
    declare height: number;
    declare number_of_phone: string;
    declare password: string;
    declare age: number;
    declare is_disabled: boolean;
    declare email: string;
    declare picture: string;
    declare token: string;
    declare disability_type: string;
    declare id_programme: number | null;
    declare id_adventure: number | null;
    declare id_partner: number | null;
    declare id_role: number | null;


    static associate(models: any) {
      // Association with Programme
      User.belongsTo(models.Programme, { foreignKey: 'id_programme' });
      
      // Association with Partner
      User.belongsTo(models.Partner, { foreignKey: 'id_partner' });
      
      // Association with Role
      User.belongsTo(models.Role, { foreignKey: 'id_role', as: 'role' });
      
      // Association with Event (via id_adventure which seems to be id_event in SQL)
      User.belongsTo(models.Event, { foreignKey: 'id_adventure', as: 'event' });
      
      // Association with Subscription is handled differently in SQL
      // No direct association from User to Subscription in the SQL dump
    }
  }

  User.init(
    {
      id_user: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      first_name: { type: DataTypes.STRING(50), allowNull: true },
      last_name: { type: DataTypes.STRING(50), allowNull: true },
      size: { type: DataTypes.INTEGER, allowNull: true },
      height: { type: DataTypes.INTEGER, allowNull: true },
      number_of_phone: { type: DataTypes.STRING(50), allowNull: true },
      password: { type: DataTypes.STRING(200), allowNull: true },
      age: { type: DataTypes.SMALLINT, allowNull: true },
      is_disabled: { type: DataTypes.BOOLEAN, allowNull: true },
      email: { type: DataTypes.STRING(50), allowNull: true },
      picture: { type: DataTypes.STRING(50), allowNull: true },
      token: { type: DataTypes.STRING(300), allowNull: true },
      disability_type: { type: DataTypes.STRING(50), allowNull: true },
      id_programme: { type: DataTypes.INTEGER, allowNull: true },
      id_adventure: { type: DataTypes.INTEGER, allowNull: true },
      id_partner: { type: DataTypes.INTEGER, allowNull: true },
      id_role: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'user',
      timestamps: false,
    }
  );

  return User;
};