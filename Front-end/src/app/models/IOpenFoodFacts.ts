// Front-end/src/app/models/IOpenFoodFacts.ts

export interface OFFNutriments {
  'energy-kcal_100g'?:     number;
  'proteins_100g'?:        number;
  'carbohydrates_100g'?:   number;
  'fat_100g'?:             number;
  'fiber_100g'?:           number;
  'sugars_100g'?:          number;
  'saturated-fat_100g'?:   number;
  'sodium_100g'?:          number;
}

export interface OFFProduct {
  id:            string;
  product_name:  string;
  image_url?:    string;
  nutriments:    OFFNutriments;
}

export interface OFFSearchResponse {
  count:    number;
  page:     number;
  page_size: number;
  products: OFFProduct[];
}

// Interface normalisée utilisée dans toute l'app
export interface NormalizedFood {
  id:            string;
  name:          string;
  image?:        string;
  energy:        number; // kcal/100g
  protein:       number; // g/100g
  carbohydrates: number; // g/100g
  fat:           number; // g/100g
  fiber:         number; // g/100g
}