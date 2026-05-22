import { IExercise } from './IExercise';
export interface ExerciseDetail extends IExercise {
  id: number;
  uuid: string;
  created: string;
  last_update: string;
  category: number;
  muscles: number[];
  muscles_secondary: number[];
  equipment: number[];
  license_author: string;
  name: string | null;
  description: string | null;
  images: { url: string; is_main: boolean }[];
  videos: {
    url: string;
    is_main: boolean;
    duration: number;
    width: number;
    height: number;
    codec: string;
  }[];
}
