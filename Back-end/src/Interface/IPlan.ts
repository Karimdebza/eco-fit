import { IMeal } from './IMeal';

export interface IPlan {
  id: number;
  creation_date: string; // ISO date (YYYY-MM-DD)
  description: string;
  only_logging: boolean;
  goal_energy: number;
  goal_protein: number;
  goal_carbohydrates: number;
  goal_fat: number;
  goal_fiber: number;
  meals?: IMeal[]; // facultatif selon les cas
}