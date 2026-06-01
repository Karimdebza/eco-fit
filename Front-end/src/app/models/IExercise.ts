export interface IExercise {
  id: string;
  slug: string;
  name: string;
  category: string;
  level: string;
  force: string;
  mechanic: string;
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  images: { url: string }[];
}