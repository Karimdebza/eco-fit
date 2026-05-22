import { IMealItem } from "./IMealItem";
import { NutritionalValues } from "./INutritionalValues"

export interface IMeal {
  id: number;
  plan: number;
  order: number;
  time: string; // e.g. "14:15:22Z"
  name: string;
  meal_items: IMealItem[];
  nutritional_values: NutritionalValues;
}
