export interface IAliment {
 id: number;
  uuid: string;
  remote_id: string;
  source_name: string;
  source_url: string;
  code: string;
  name: string;
  created: string;
  last_update: string;
  last_imported: string;
  energy: number;
  protein: string;
  carbohydrates: string;
  carbohydrates_sugar: string;
  fat: string;
  fat_saturated: string;
  fiber: string;
  sodium: string;
  license: {
    id: number;
    full_name: string;
    short_name: string;
    url: string;
  };
  license_title: string;
  license_object_url: string;
  license_author: string;
  license_author_url: string;
  license_derivative_source_url: string;
  language: {
    id: number;
    short_name: string;
    full_name: string;
  };
  weight_units: any[]; 
  image: {
    id: number;
    image: string;
  };
  description: string;
}