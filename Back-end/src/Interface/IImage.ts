export interface IImage {
  id: number;
  uuid: string;
  ingredient_id: number;
  ingredient_uuid: string;
  image: string;
  created: string;
  last_update: string;
  size: number;
  width: number;
  height: number;
  license: number;
  license_title: string;
  license_object_url: string;
  license_author: string;
  license_author_url: string;
  license_derivative_source_url: string;
}