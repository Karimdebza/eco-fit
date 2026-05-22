// programmeModel.ts
import { Sequelize, DataTypes as DT, Model } from 'sequelize';

export default (sequelize: Sequelize, DataTypes: typeof DT) => {
  class Programme extends Model {
    declare id_programme: number;
    declare name: string;
    declare niveau: string;
    declare durer: number;
    declare needs_handicap: boolean;

    static associate(models: any) {
      // One-to-many with User
      Programme.hasMany(models.User, { foreignKey: 'id_programme' });
      
      // Many-to-many with Exercise through ProgrammeExercise
      Programme.belongsToMany(models.Exercise, { 
        through: models.ProgrammeExercise,
        foreignKey: 'id_programme',
        otherKey: 'id_exercise'
      });
    }
  }
  
  Programme.init({
  id_programme: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false },
  name: { type: DataTypes.STRING(50), allowNull: true },
  niveau: { type: DataTypes.STRING(50), allowNull: true },
  durer: { type: DataTypes.INTEGER, allowNull: true },
  needs_handicap: { type: DataTypes.BOOLEAN, allowNull: true },
}, {
  sequelize,
  modelName: 'Programme',
  tableName: 'programme',
  timestamps: false
});

  return Programme;
};