import { Router } from 'express';
import  {subscriptionController}  from '../Controller/SubscriptionController';

const router = Router();

router.get('/', subscriptionController.getAll);
router.get('/:id', subscriptionController.getById);
router.post('/', subscriptionController.create);
router.put('/:id', subscriptionController.update);
router.delete('/:id', subscriptionController.delete);
router.put('/:id/renew', subscriptionController.renewSubscription);
router.put('/:id/cancel', subscriptionController.cancelSubscription);

export default router;