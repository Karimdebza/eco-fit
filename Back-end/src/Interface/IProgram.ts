export interface IProgram {
    id_program: number;
    name: string;
    niveau: number;
    date: Date;
    type: string;
    id_user: number;
    is_handicap?: boolean;
  }