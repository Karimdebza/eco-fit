import { Router } from 'express';
import { partnerController } from '../Controller/PartnerController';

const router = Router();

router.get('/', partnerController.getAll);
router.get('/:id', partnerController.getById);
router.post('/', partnerController.create);
router.put('/:id', partnerController.update);
router.delete('/:id', partnerController.delete);

export default router;
