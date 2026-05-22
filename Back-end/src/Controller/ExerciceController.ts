import { Request, Response } from 'express'
import BaseController from './BaseController'
import { exerciseService } from '../Service/ExerciceService'
import asyncHandler from '../utils/asyncHandler'
import db from '../Model'

class ExerciseController extends BaseController<typeof db.Exercise> {
  constructor() {
    super(exerciseService, 'Exercice')
  }

  public async getAll(req: Request, res: Response) {
    try {
      //req.query 
      const exercises = await exerciseService.getAllExercises()
      res.json(exercises)
    } catch (error) {
      console.error('Erreur lors de la récupération des exercices:', error)
      res.status(500).json({ status: 'error', message: 'Erreur serveur' })
    }
  }

  public async getExerciseById(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return res.status(400).json({ status: 'error', message: 'ID invalide' })
    }
    try {
      const exercise = await exerciseService.getExerciseDetail(id)
      if (!exercise) {
        return res.status(404).json({ status: 'error', message: 'Exercice non trouvé' })
      }
      res.json({ status: 'success', data: exercise })
    } catch (error) {
      console.error("Erreur lors de la récupération de l'exercice:", error)
      res.status(500).json({ status: 'error', message: 'Erreur serveur' })
    }
  }

  public async searchByName(req: Request, res: Response) {
    const { name } = req.query
    if (!name) {
      return res.status(400).json({ status: 'error', message: 'Nom requis' })
    }

    const results = await exerciseService.searchExercisesByName(String(name))
    if (results.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Aucun exercice trouvé avec ce nom',
      })
    }

    res.json({ status: 'success', data: results })
  }

  public async getFilteredExercises(req: Request, res: Response) {
    const filtered = await exerciseService.getFilteredExercises(req.query)
    if (filtered.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Aucun exercice trouvé avec ces critères',
      })
    }
    res.json({ status: 'success', data: filtered })
  }

  public async countExercises(req: Request, res: Response) {
    const count = await exerciseService.countExercises()
    res.json({ status: 'success', count })
  }
}

const controller = new ExerciseController()

export const exerciseController = {
  getAll: asyncHandler(controller.getAll.bind(controller)),
  getExerciseById: asyncHandler(controller.getExerciseById.bind(controller)),
  create: asyncHandler(controller.create.bind(controller)),
  update: asyncHandler(controller.update.bind(controller)),
  delete: asyncHandler(controller.delete.bind(controller)),
  searchByName: asyncHandler(controller.searchByName.bind(controller)),
  getFilteredExercises: asyncHandler(controller.getFilteredExercises.bind(controller)),
  countExercises: asyncHandler(controller.countExercises.bind(controller)),
}
