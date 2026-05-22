import { Router } from 'express';
import { exerciseController } from '../Controller/ExerciceController';

const router = Router();

router.get('/filter', exerciseController.getFilteredExercises);
router.get('/search/by-name', exerciseController.searchByName);
router.get('/count', exerciseController.countExercises);
router.get('/:id', exerciseController.getExerciseById);
router.get('/', exerciseController.getAll);
router.post('/', exerciseController.create);
router.put('/:id', exerciseController.update);
router.delete('/:id', exerciseController.delete);

export default router;
