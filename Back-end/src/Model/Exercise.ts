import { Sequelize, DataTypes as DT, Model } from 'sequelize';

export default (sequelize: Sequelize, DataTypes: typeof DT) => {
  class Exercise extends Model {
    declare id_exercise: number;
    declare name: string;
    declare accessibility: string;
    declare time_of_exercise: number;
    declare needs_materials: boolean;
    declare objectif_targeted: string;
    declare url_video: string;
    declare number_of_set: number;
    declare nombre_of_rep: number;
    declare description: string;

    static associate(models: any) {
      // Many-to-many with Programme through ProgrammeExercise
      Exercise.belongsToMany(models.Programme, { 
        through: models.ProgrammeExercise,
        foreignKey: 'id_exercise',
        otherKey: 'id_programme'
      });
    }
  }

  Exercise.init({
    id_exercise: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false },
    name: { type: DataTypes.STRING(50), allowNull: true },
    accessibility: { type: DataTypes.STRING(50), allowNull: true },
    time_of_exercise: { type: DataTypes.INTEGER, allowNull: true },
    needs_materials: { type: DataTypes.BOOLEAN, allowNull: true },
    objectif_targeted: { type: DataTypes.STRING(50), allowNull: true },
    url_video: { type: DataTypes.STRING(200), allowNull: true },
    number_of_set: { type: DataTypes.INTEGER, allowNull: true },
    nombre_of_rep: { type: DataTypes.INTEGER, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true }
  }, {
    sequelize,
    modelName: 'Exercise',
    tableName: 'exercise',
    timestamps: false
  });

  return Exercise;
};
