import { Router } from 'express';
import { alimentationController } from '../Controller/AlimentationController';

const router = Router();


router.get('/', alimentationController.getAll);
router.get('/:id', alimentationController.getById);
// router.post('/', alimentationController.create);
// router.put('/:id', alimentationController.update);
// router.delete('/:id', alimentationController.delete);
// router.post('/add-exercise', alimentationController.addExerciseToProgram);
// router.get('/:id/exercises', alimentationController.getExercisesForProgram);

export default router;