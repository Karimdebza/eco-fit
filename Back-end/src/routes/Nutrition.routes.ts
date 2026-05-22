// Back-end/src/routes/nutrition.routes.ts
import { Router } from 'express';
import { nutritionController } from '../Controller/NutritionController';
import { authMiddleware } from '../Middleware/authenticateJWT';

const router = Router();

// Toutes les routes nutrition sont protégées
router.use(authMiddleware);

router.post('/',           nutritionController.addEntry);    // Ajouter au journal
router.get('/journal',     nutritionController.getJournal);  // GET /journal?date=2025-05-22
router.get('/history',     nutritionController.getHistory);  // GET /history?days=7
router.delete('/:id',      nutritionController.deleteEntry); // Supprimer une entrée

export default router;