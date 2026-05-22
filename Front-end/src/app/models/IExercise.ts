export interface IExercise {
  id: number;
  uuid: string;
  name: string;
  description: string;
  category: number;
  muscles: number[];
  created:Date;
  last_update: Date;
  muscles_secondary: number[];
  equipment: number[];
  license_author: string;
  images: {url:string}[];
  videos: {url:string}[];
}
