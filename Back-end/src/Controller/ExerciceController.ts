import { Request, Response } from 'express';
import BaseController from './BaseController';
import { exerciseService } from '../Service/ExerciceService';
import asyncHandler from '../utils/asyncHandler';
import db from '../Model';

class ExerciseController extends BaseController<typeof db.Exercise> {
  constructor() {
    super(exerciseService, 'Exercice');
  }

  public async getAll(req: Request, res: Response) {
    try {
      const limit  = Math.min(Number(req.query.limit)  || 20, 100);
      const offset = Number(req.query.offset) || 0;
      const result = await exerciseService.getAllExercises(limit, offset);
      res.json(result);
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Erreur serveur' });
    }
  }

  public async getExerciseById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ status: 'error', message: 'ID invalide' });
    try {
      const exercise = await exerciseService.getExerciseDetail(id);
      if (!exercise) return res.status(404).json({ status: 'error', message: 'Exercice non trouvé' });
      res.json({ status: 'success', data: exercise });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Erreur serveur' });
    }
  }

  public async searchByName(req: Request, res: Response) {
    const { name } = req.query;
    if (!name) return res.status(400).json({ status: 'error', message: 'Nom requis' });
    try {
      const result = await exerciseService.searchExercisesByName(String(name));
      res.json({ status: 'success', ...result });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Erreur serveur' });
    }
  }

  public async getFilteredExercises(req: Request, res: Response) {
    try {
      const limit  = Math.min(Number(req.query.limit)  || 20, 100);
      const offset = Number(req.query.offset) || 0;
      const result = await exerciseService.getFilteredExercises(req.query, limit, offset);
      res.json({ status: 'success', ...result });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Erreur serveur' });
    }
  }

  public async countExercises(req: Request, res: Response) {
    try {
      const count = await exerciseService.countExercises();
      res.json({ status: 'success', count });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Erreur serveur' });
    }
  }

  public async getFilterOptions(req: Request, res: Response) {
    try {
      const options = await exerciseService.getFilterOptions();
      res.json({ status: 'success', data: options });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Erreur serveur' });
    }
  }
}

const controller = new ExerciseController();

export const exerciseController = {
  getAll:               asyncHandler(controller.getAll.bind(controller)),
  getExerciseById:      asyncHandler(controller.getExerciseById.bind(controller)),
  create:               asyncHandler(controller.create.bind(controller)),
  update:               asyncHandler(controller.update.bind(controller)),
  delete:               asyncHandler(controller.delete.bind(controller)),
  searchByName:         asyncHandler(controller.searchByName.bind(controller)),
  getFilteredExercises: asyncHandler(controller.getFilteredExercises.bind(controller)),
  countExercises:       asyncHandler(controller.countExercises.bind(controller)),
  getFilterOptions:     asyncHandler(controller.getFilterOptions.bind(controller)),
};