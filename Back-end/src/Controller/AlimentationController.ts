import { Request, Response } from 'express';
import { alimentationService } from '../Service/AlimentationService';
import asyncHandler from '../utils/asyncHandler';

class AlimentationController {
  
  async getAll(req: Request, res: Response) {
    try {
      const data = await alimentationService.getAllEngredients();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    try {
      const data = await alimentationService.getIngredientById(id);
      if (!data) {
        return res.status(404).json({ message: 'Aliment not found' });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

const controller = new AlimentationController();

export const alimentationController = {
  getAll: asyncHandler(controller.getAll.bind(controller)),
  getById: asyncHandler(controller.getById.bind(controller)),
};
