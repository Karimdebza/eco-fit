import { Sequelize, DataTypes as DT, Model } from 'sequelize';

export default (sequelize: Sequelize, DataTypes: typeof DT) => {
  class Exercise extends Model {
    declare id_exercise: number;
    declare slug: string;           // ex: "Alternate_Incline_Dumbbell_Curl"
    declare name: string;
    declare category: string;       // strength, cardio, stretching...
    declare level: string;          // beginner, intermediate, expert
    declare force: string | null;   // pull, push, static
    declare mechanic: string | null;
    declare equipment: string | null;
    declare primary_muscles: string;   // JSON array stocké en TEXT
    declare secondary_muscles: string; // JSON array stocké en TEXT
    declare instructions: string;      // JSON array stocké en TEXT
    declare images: string;            // JSON array stocké en TEXT

    static associate(models: any) {
      Exercise.belongsToMany(models.Programme, {
        through: models.ProgrammeExercise,
        foreignKey: 'id_exercise',
        otherKey: 'id_programme'
      });
    }
  }

  Exercise.init({
    id_exercise:       { type: DataTypes.INTEGER,      primaryKey: true, autoIncrement: true },
    slug:              { type: DataTypes.STRING(200),  allowNull: false, unique: true },
    name:              { type: DataTypes.STRING(200),  allowNull: false },
    category:          { type: DataTypes.STRING(50),   allowNull: true },
    level:             { type: DataTypes.STRING(20),   allowNull: true },
    force:             { type: DataTypes.STRING(20),   allowNull: true },
    mechanic:          { type: DataTypes.STRING(30),   allowNull: true },
    equipment:         { type: DataTypes.STRING(50),   allowNull: true },
    primary_muscles:   { type: DataTypes.TEXT,         allowNull: true },
    secondary_muscles: { type: DataTypes.TEXT,         allowNull: true },
    instructions:      { type: DataTypes.TEXT('long'), allowNull: true },
    images:            { type: DataTypes.TEXT,         allowNull: true },
  }, {
    sequelize,
    modelName: 'Exercise',
    tableName: 'exercise',
    timestamps: false,
  });

  return Exercise;
};