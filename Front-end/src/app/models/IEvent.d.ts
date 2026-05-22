import { IUser } from './IUser';

export interface IEvent {
  id_event: number;
  title: string;
  place: string;
  date_of_event: string; 
  themes: string;
  nombre_of_participant: number;
  rating: number;
  image: string;
  description: string;
  participants: IUser[];
}