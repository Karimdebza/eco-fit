
import { WgerApiResponse } from '../Interface/WgerApiResponse';
import { IPaginatedResponse } from '../Interface/IPaginatedResponse';
import { IPlan } from '../Interface/IPlan';
import { IMeal } from '../Interface/IMeal';
import { IIngredient } from '../Interface/IIngredient';
import { IWeightUnit } from '../Interface/IWeightUnit';


// Après
import axios from 'axios';
import 'dotenv/config';


// const TOKEN = process.env.WGER_API_TOKEN;


interface IngredientInfo {
  id: number;
  name: string;
  energy: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
}
interface IngredientImage {
  id: number;
  ingredient: number;
  image: string;
  is_main: boolean;
}

export class AlimentationService {

 async getAllEngredients() {
   const response = await axios.get<WgerApiResponse<IIngredient>>('https://wger.de/api/v2/ingredient/');


  const data = response.data;

  // Optionnel : valider que le format correspond bien
  if (!data || !Array.isArray(data.results)) {
    throw new Error('Invalid response format');
  }

  // Mapper les résultats pour correspondre à l'interface IIngredient

  

   const enrichedResults = await Promise.all(
    data.results.map(async (item: IIngredient) => {
      const [infoRes, imageRes] = await Promise.all([
        axios.get<WgerApiResponse<IngredientInfo>>(`https://wger.de/api/v2/ingredientinfo/?ingredient=${item.id}`),
        axios.get<WgerApiResponse<IngredientImage>>(`https://wger.de/api/v2/ingredient-image/?ingredient=${item.id}`)
      ]);

      const info = infoRes.data.results?.[0] || null;
      const image = imageRes.data.results?.[0] || null;

      return {
        id: item.id,
        uuid: item.uuid,
        remote_id: item.remote_id,
        source_name: item.source_name,
        source_url: item.source_url,
        code: item.code,
        name: item.name,
        created: item.created,
        last_update: item.last_update,
        last_imported: item.last_imported,
        energy: item.energy,
        protein: item.protein,
        carbohydrates: item.carbohydrates,
        carbohydrates_sugar: item.carbohydrates_sugar,
        fat: item.fat,
        fat_saturated: item.fat_saturated,
        fiber: item.fiber,
        sodium: item.sodium,
        license: {
          id: item.license,
          full_name: '',
          short_name: '',
          url: ''
        },
        license_title: item.license_title,
        license_object_url: item.license_object_url,
        license_author: item.license_author,
        license_author_url: item.license_author_url,
        license_derivative_source_url: item.license_derivative_source_url,
        language: {
          id: item.language,
          short_name: '',
          full_name: ''
        },
        weight_units: [], // Tu peux compléter après
        image: image ? {
          id: image.id,
          image: image.image,
          is_main: image.is_main,
          ingredient: image.ingredient
        } : null,
        description: info.name || ''
      };
    })
  );

  return {
    count: data.count,
    next: data.next,
    previous: data.previous,
    results: enrichedResults
  };
  }

  
 
  async getIngredientById(id: number): Promise<IIngredient | null> {
  
   
    const ingredientRes = await axios.get<IIngredient>(`https://wger.de/api/v2/ingredient/${id}/`);
    const item = ingredientRes.data;

    // Récupère les infos supplémentaires et l'image en parallèle
    const [infoRes, imageRes] = await Promise.all([
      axios.get<WgerApiResponse<IngredientInfo>>(`https://wger.de/api/v2/ingredientinfo/?ingredient=${item.id}`),
      axios.get<WgerApiResponse<IngredientImage>>(`https://wger.de/api/v2/ingredient-image/?ingredient=${item.id}`)
    ]);

    const info = infoRes.data.results?.[0] || null;
    const image = imageRes.data.results?.[0] || null;

    // Construit l'objet enrichi
    const enrichedIngredient: IIngredient = {
      id: item.id,
      uuid: item.uuid,
      remote_id: item.remote_id,
      source_name: item.source_name,
      source_url: item.source_url,
      code: item.code,
      name: item.name,
      created: item.created,
      last_update: item.last_update,
      last_imported: item.last_imported,
      energy: item.energy,
      protein: item.protein,
      carbohydrates: item.carbohydrates,
      carbohydrates_sugar: item.carbohydrates_sugar,
      fat: item.fat,
      fat_saturated: item.fat_saturated,
      fiber: item.fiber,
      sodium: item.sodium,
      license: item.license,
    
      license_title: item.license_title,
      license_object_url: item.license_object_url,
      license_author: item.license_author,
      license_author_url: item.license_author_url,
      license_derivative_source_url: item.license_derivative_source_url,
      language:  item.language,
      weight_units: [], // À remplir si tu récupères cette info
      image: image ? {
        id: image.id,
        image: image.image,
        is_main: image.is_main,
        ingredient: image.ingredient
      } : null,

    };

    return enrichedIngredient;

  
}

  



}

export const alimentationService = new AlimentationService();
console.log("Token WGER chargé :", process.env.WGER_API_TOKEN);
