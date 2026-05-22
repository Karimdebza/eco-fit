// partnerModel.ts
import { Sequelize, DataTypes as DT, Model } from 'sequelize';

export default (sequelize: Sequelize, DataTypes: typeof DT) => {
  class Partner extends Model {
    declare id_partner: number;
    declare name: string;
    declare url_of_image: string;
    declare description: string;
    declare eco_score: number;
    declare id_event: number | null;

    static associate(models: any) {
      // One-to-one with Event
      Partner.belongsTo(models.Event, { foreignKey: 'id_event' });
      
      // One-to-many with User
      Partner.hasMany(models.User, { foreignKey: 'id_partner' });
    }
  }

  Partner.init(
    {
      id_partner: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false },
      name: { type: DataTypes.STRING(50), allowNull: true },
      url_of_image: { type: DataTypes.STRING(200), allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      eco_score: { type: DataTypes.INTEGER, allowNull: true },
      id_event: { type: DataTypes.INTEGER, allowNull: true, unique: true },
    },
    {
      sequelize,
      modelName: 'Partner',
      tableName: 'partner',
      timestamps: false,
    }
  );

  return Partner;
};