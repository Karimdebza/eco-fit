export interface IUserSignup {
  last_name:        string;
  first_name:       string;
  email:            string;
  password:         string;
  number_of_phone:  string;
  size:             number;
  height:           number;
  age:              number;
  picture?:         string; // optionnel à l'inscription
  disability_type:  string; // corrigé : était disabilty_status (faute de frappe)
}