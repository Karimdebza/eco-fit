import { IExercise } from "./IExercise";

export interface IExerciseResponse  {
  count: number;
  next: string | null;
  previous: string | null;
  results: IExercise[];

}