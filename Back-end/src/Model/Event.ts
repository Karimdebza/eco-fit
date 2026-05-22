// eventModel.ts
import { Sequelize, DataTypes as DT, Model } from 'sequelize';

export default (sequelize: Sequelize, DataTypes: typeof DT) => {
  class Event extends Model {
    declare id_event: number;
    declare title: string;
    declare place: string;
    declare date_of_event: Date;
    declare themes: string;
    declare image: string;
    declare nombre_of_participant: number;
    declare rating: number;
    declare description: string;

    static associate(models: any) {
      // One-to-one with Partner
      Event.hasOne(models.Partner, { foreignKey: 'id_event' });
      
      // One-to-many with User
      Event.hasMany(models.User, { foreignKey: 'id_adventure', as: 'participants' });
    }
  }

  Event.init(
    {
      id_event: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING(50), allowNull: true },
      place: { type: DataTypes.STRING(50), allowNull: true },
      image: { type: DataTypes.STRING(300), allowNull: true },
      date_of_event: { type: DataTypes.DATE, allowNull: true },
      themes: { type: DataTypes.STRING(50), allowNull: true },
      nombre_of_participant: { type: DataTypes.INTEGER, allowNull: true },
      rating: { type: DataTypes.INTEGER, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Event',
      tableName: 'event',
      timestamps: false,
    }
  );

  return Event;
};
