// Back-end/src/Service/NutritionService.ts
import db from '../Model';
import { Op } from 'sequelize';

interface CreateEntryDTO {
  ingredient_id: number;
  ingredient_name: string;
  quantity_g: number;
  // Valeurs pour 100g — on calcule selon quantity_g
  energy_per100: number;
  protein_per100: number;
  carbs_per100: number;
  fat_per100: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string; // YYYY-MM-DD
}

export class NutritionService {

  /**
   * Ajoute une entrée au journal.
   * Les macros sont calculées proportionnellement à quantity_g.
   * On dénormalise le nom et les valeurs pour éviter des appels API à chaque lecture.
   */
  async addEntry(userId: number, dto: CreateEntryDTO) {
    const ratio = dto.quantity_g / 100;

    return db.NutritionEntry.create({
      id_user:         userId,
      ingredient_id:   dto.ingredient_id,
      ingredient_name: dto.ingredient_name,
      quantity_g:      dto.quantity_g,
      calories:        Math.round(dto.energy_per100 * ratio * 10) / 10,
      protein:         Math.round(dto.protein_per100 * ratio * 10) / 10,
      carbohydrates:   Math.round(dto.carbs_per100 * ratio * 10) / 10,
      fat:             Math.round(dto.fat_per100 * ratio * 10) / 10,
      meal_type:       dto.meal_type,
      date:            dto.date,
    });
  }

  /**
   * Récupère toutes les entrées d'un user pour une date donnée.
   * Groupées par meal_type côté service pour simplifier le front.
   */
  async getJournalByDate(userId: number, date: string) {
    const entries = await db.NutritionEntry.findAll({
      where: { id_user: userId, date },
      order: [['createdAt', 'ASC']],
    });

    // Totaux du jour
    const totals = entries.reduce(
      (acc: any, e: any) => ({
        calories:      Math.round((acc.calories + e.calories) * 10) / 10,
        protein:       Math.round((acc.protein + e.protein) * 10) / 10,
        carbohydrates: Math.round((acc.carbohydrates + e.carbohydrates) * 10) / 10,
        fat:           Math.round((acc.fat + e.fat) * 10) / 10,
      }),
      { calories: 0, protein: 0, carbohydrates: 0, fat: 0 }
    );

    // Groupement par repas
    const grouped = {
      breakfast: entries.filter((e: any) => e.meal_type === 'breakfast'),
      lunch:     entries.filter((e: any) => e.meal_type === 'lunch'),
      dinner:    entries.filter((e: any) => e.meal_type === 'dinner'),
      snack:     entries.filter((e: any) => e.meal_type === 'snack'),
    };

    return { date, totals, meals: grouped, entries };
  }

  /**
   * Historique sur N jours — pour le graphe hebdomadaire.
   */
  async getHistory(userId: number, days: number = 7) {
    const from = new Date();
    from.setDate(from.getDate() - (days - 1));
    const fromStr = from.toISOString().split('T')[0];

    const entries = await db.NutritionEntry.findAll({
      where: {
        id_user: userId,
        date: { [Op.gte]: fromStr },
      },
      order: [['date', 'ASC']],
    });

    // Agréger par date
    const byDate: Record<string, number> = {};
    entries.forEach((e: any) => {
      byDate[e.date] = Math.round(((byDate[e.date] || 0) + e.calories) * 10) / 10;
    });

    return byDate;
  }

  async deleteEntry(userId: number, entryId: number) {
    const entry = await db.NutritionEntry.findOne({
      where: { id: entryId, id_user: userId }, // vérifie que l'entrée appartient bien au user
    });
    if (!entry) throw new Error('NotFound');
    await entry.destroy();
  }
}

export const nutritionService = new NutritionService();