// Back-end/src/Model/NutritionEntry.ts
import { Sequelize, DataTypes as DT, Model } from 'sequelize';

export default (sequelize: Sequelize, DataTypes: typeof DT) => {
  class NutritionEntry extends Model {
    declare id: number;
    declare id_user: number;
    declare ingredient_id: number;   // ID wger — pas de FK en DB car externe
    declare ingredient_name: string; // Dénormalisé pour éviter un appel API à chaque lecture
    declare quantity_g: number;
    declare calories: number;        // Dénormalisé aussi — calculé à l'ajout
    declare protein: number;
    declare carbohydrates: number;
    declare fat: number;
    declare meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    declare date: string;            // format YYYY-MM-DD

    static associate(models: any) {
      NutritionEntry.belongsTo(models.User, { foreignKey: 'id_user' });
    }
  }

  NutritionEntry.init(
    {
      id:              { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      id_user:         { type: DataTypes.INTEGER, allowNull: false },
      ingredient_id: { type: DataTypes.STRING(50), allowNull: false },
      ingredient_name: { type: DataTypes.STRING(200), allowNull: false },
      quantity_g:      { type: DataTypes.FLOAT, allowNull: false },
      calories:        { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
      protein:         { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
      carbohydrates:   { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
      fat:             { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
      meal_type: {
        type: DataTypes.ENUM('breakfast', 'lunch', 'dinner', 'snack'),
        allowNull: false,
        defaultValue: 'snack'
      },
      date: { type: DataTypes.DATEONLY, allowNull: false }, // DATEONLY = YYYY-MM-DD sans time
    },
    {
      sequelize,
      modelName: 'NutritionEntry',
      tableName: 'nutrition_entry',
      timestamps: true, // createdAt / updatedAt auto
    }
  );

  return NutritionEntry;
};