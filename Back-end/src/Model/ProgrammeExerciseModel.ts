// programmeExerciseModel.ts
import { Sequelize, DataTypes as DT, Model } from 'sequelize';

export default (sequelize: Sequelize, DataTypes: typeof DT) => {
  class ProgrammeExercise extends Model {
    declare id_programme: number;
    declare id_exercise: number;

    static associate(models: any) {
      // Associations are defined in Programme and Exercise models
    }
  }
  
  ProgrammeExercise.init({
    id_programme: { 
      type: DataTypes.INTEGER, 
      primaryKey: true,
      references: {
        model: 'programme',
        key: 'id_programme'
      }
    },
    id_exercise: { 
      type: DataTypes.INTEGER, 
      primaryKey: true,
      references: {
        model: 'exercise',
        key: 'id_exercise'
      }
    }
  }, {
    sequelize,
    modelName: 'ProgrammeExercise',
    tableName: 'programme_exercise',
    timestamps: false
  });

  return ProgrammeExercise;
};
