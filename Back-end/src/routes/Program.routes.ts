import { Router } from 'express';
import { programController } from '../Controller/ProgramController';

const router = Router();


router.get('/', programController.getAll);
router.get('/filter', programController.getFilteredPrograms);
router.get('/:id', programController.getById);
router.post('/', programController.create);
router.put('/:id', programController.update);
router.delete('/:id', programController.delete);
router.post('/add-exercise', programController.addExerciseToProgram);
router.get('/:id/exercises', programController.getExercisesForProgram);

export default router;