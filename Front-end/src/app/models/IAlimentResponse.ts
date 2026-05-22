import { IAliment } from './IAlimentation';

export interface IAlimentResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IAliment[];
}