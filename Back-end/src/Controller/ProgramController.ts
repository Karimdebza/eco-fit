import { Request, Response } from 'express';
import BaseController from './BaseController';
import { programService } from '../Service/ProgramService';
import asyncHandler from '../utils/asyncHandler';
import db from '../Model';

class ProgramController extends BaseController<typeof db.Programme> {
  constructor() {
    super(programService, 'Programme');
  }

  public async getFilteredPrograms(req: Request, res: Response) {
    const programs = await programService.getFilteredPrograms(req.query);
    if (programs.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Aucun programme trouvé avec ces critères' });
    }
    res.json({ status: 'success', data: programs });
  }

  public async addExerciseToProgram(req: Request, res: Response) {
  const { id_programme, id_exercise } = req.body;

  if (!id_programme || !id_exercise || isNaN(Number(id_programme)) || isNaN(Number(id_exercise))) {
  return res.status(400).json({
    status: 'error',
    message: 'id_programme et id_exercise sont requis et doivent être des nombres valides'
  });
}

  try {
    const programme = await db.Programme.findByPk(id_programme);
    const exercise = await db.Exercise.findByPk(id_exercise);

    if (!programme || !exercise) {
      return res.status(404).json({ status: 'error', message: 'Programme ou Exercice introuvable' });
    }
    await programme.addExercise(exercise);

    return res.json({ status: 'success', message: 'Exercice ajouté au programme avec succès' });
  } catch (error) {
    console.error('Erreur addExerciseToProgram:', error);
    return res.status(500).json({ status: 'error', message: 'Erreur serveur', error });
  }
}

public async getExercisesForProgram(req: Request, res: Response) {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({
      status: 'error',
      message: 'L\'id du programme doit être un nombre valide'
    });
  }

  try {
    const programme = await db.Programme.findByPk(id, {
      include: {
        model: db.Exercise,
        through: { attributes: [] }
      }
    });

    if (!programme) {
      return res.status(404).json({ status: 'error', message: 'Programme introuvable' });
    }

    return res.json({ status: 'success', data: programme });
  } catch (error) {
    console.error('Erreur getExercisesForProgram:', error);
    return res.status(500).json({ status: 'error', message: 'Erreur serveur', error });
  }
}
}

const controller = new ProgramController();

export const programController = {
  getAll: asyncHandler(controller.getAll.bind(controller)),
  getById: asyncHandler(controller.getById.bind(controller)),
  create: asyncHandler(controller.create.bind(controller)),
  update: asyncHandler(controller.update.bind(controller)),
  delete: asyncHandler(controller.delete.bind(controller)),
  getFilteredPrograms: asyncHandler(controller.getFilteredPrograms.bind(controller)),
  addExerciseToProgram: asyncHandler(controller.addExerciseToProgram.bind(controller)),
  getExercisesForProgram: asyncHandler(controller.getExercisesForProgram.bind(controller)),
};
