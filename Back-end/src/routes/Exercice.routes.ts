import { Router } from 'express';
import { exerciseController } from '../Controller/ExerciceController';

const router = Router();

// Routes statiques avant /:id
router.get('/filter-options',  exerciseController.getFilterOptions);
router.get('/filter',          exerciseController.getFilteredExercises);
router.get('/search/by-name',  exerciseController.searchByName);
router.get('/count',           exerciseController.countExercises);
router.get('/',                exerciseController.getAll);
router.post('/',               exerciseController.create);

// Routes dynamiques
router.get('/:id',             exerciseController.getExerciseById);
router.put('/:id',             exerciseController.update);
router.delete('/:id',          exerciseController.delete);

export default router;