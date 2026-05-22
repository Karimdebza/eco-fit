import { IUser } from "./IUser";

export interface IUserResponse {
  status: string;
  data: IUser;
  token: string;
}