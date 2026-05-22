// roleModel.ts
import { Sequelize, DataTypes as DT, Model } from 'sequelize';

export default (sequelize: Sequelize, DataTypes: typeof DT) => {
  class Role extends Model {
    declare id_role: number;
    declare libelle: string;
    declare type: string;

    static associate(models: any) {
      // One-to-many with User
      Role.hasMany(models.User, { foreignKey: 'id_role' });
    }
  }

  Role.init(
    {
      id_role: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false },
      libelle: { type: DataTypes.STRING(50), allowNull: true },
      type: { type: DataTypes.STRING(50), allowNull: true }
    },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'role',
      timestamps: false,
    }
  );

  return Role;
};
