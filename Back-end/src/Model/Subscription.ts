import { Sequelize, DataTypes as DT, Model } from 'sequelize';

export default (sequelize: Sequelize, DataTypes: typeof DT) => {
  class Subscription extends Model {
    declare id_subscription: number;
    declare name: string;
    declare durer: Date;
    declare price: number;
    declare description: string;
    declare id_user: number;

    static associate(models: any) {
      // Note: In the SQL dump, there's a unique constraint on id_user,
      // which indicates a one-to-one relationship
      Subscription.belongsTo(models.User, { foreignKey: 'id_user' });
    }
  }

  Subscription.init(
    {
      id_subscription: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false },
      name: { type: DataTypes.STRING(50), allowNull: true },
      durer: { type: DataTypes.DATE, allowNull: true },
      price: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      id_user: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: 'Subscription',
      tableName: 'subscription',
      timestamps: false,
    }
  )

  return Subscription;
};
