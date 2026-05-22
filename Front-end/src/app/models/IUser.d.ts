export interface IUser {
  id_user: number;
  last_name: string;
  first_name: string;
  email: string;
  password?: string;
  number_of_phone?: string;
  size?: number;
  token?:string
  height?: number;
  age?: number;
  picture?: string;
  disability_type?: string | null;
  id_role?: number;
  id_partner?: number;
  id_adventure: number | null;
}