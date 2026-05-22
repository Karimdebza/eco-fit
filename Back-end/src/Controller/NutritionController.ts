// Back-end/src/Controller/NutritionController.ts
import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { nutritionService } from '../Service/NutritionService';

class NutritionController {

  async addEntry(req: Request, res: Response) {
     try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ status: 'error', message: 'Non authentifié' });

    const {
      ingredient_id, ingredient_name,
      quantity_g,
      energy_per100, protein_per100, carbs_per100, fat_per100,
      meal_type, date
    } = req.body;

    // Validation minimale
    if (!ingredient_id || !quantity_g || !meal_type || !date) {
      return res.status(400).json({ status: 'error', message: 'Champs requis manquants' });
    }

    const entry = await nutritionService.addEntry(userId, {
      ingredient_id,
      ingredient_name,
      quantity_g: Number(quantity_g),
      energy_per100: Number(energy_per100 ?? 0),
      protein_per100: Number(protein_per100 ?? 0),
      carbs_per100: Number(carbs_per100 ?? 0),
      fat_per100: Number(fat_per100 ?? 0),
      meal_type,
      date,
    });

    res.status(201).json({ status: 'success', data: entry });
    } catch (err: any) {
    console.error('NUTRITION ERROR:', err.message, err.parent?.message, err.original?.message);
    res.status(500).json({ message: err.message, detail: err.parent?.message });
  }
  }

  async getJournal(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ status: 'error', message: 'Non authentifié' });

    // Date du jour par défaut si non fournie
    const date = (req.query.date as string) ?? new Date().toISOString().split('T')[0];

    const journal = await nutritionService.getJournalByDate(userId, date);
    res.json({ status: 'success', data: journal });
  }

  async getHistory(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ status: 'error', message: 'Non authentifié' });

    const days = parseInt(req.query.days as string ?? '7', 10);
    const history = await nutritionService.getHistory(userId, days);
    res.json({ status: 'success', data: history });
  }

  async deleteEntry(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ status: 'error', message: 'Non authentifié' });

    const entryId = parseInt(req.params.id, 10);
    if (isNaN(entryId)) {
      return res.status(400).json({ status: 'error', message: 'ID invalide' });
    }

    await nutritionService.deleteEntry(userId, entryId);
    res.json({ status: 'success', message: 'Entrée supprimée' });
  }
}

const controller = new NutritionController();

export const nutritionController = {
  addEntry:   asyncHandler(controller.addEntry.bind(controller)),
  getJournal: asyncHandler(controller.getJournal.bind(controller)),
  getHistory: asyncHandler(controller.getHistory.bind(controller)),
  deleteEntry: asyncHandler(controller.deleteEntry.bind(controller)),
};