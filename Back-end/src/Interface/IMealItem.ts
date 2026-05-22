import { IImage } from "./IImage";
import { IIngredient } from "./IIngredient";
import { IWeightUnit } from "./IWeightUnit";
import { IImageMeal } from "./IImageMeal";


export interface IMealItem {
  id: number;
  meal: number;
  ingredient: number;
  ingredient_obj: IIngredient;
  weight_unit: number;
  weight_unit_obj: IWeightUnit;
  image: IImageMeal;
  order: number;
  amount: string; // regex string (to be parsed/validated)
}
