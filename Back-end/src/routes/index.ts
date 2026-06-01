import { Router } from 'express';
import exerciceRoutes from './Exercice.routes';
import programRoutes from './Program.routes';
import subscriptionRoutes from './Subscription.routes';
import partnerRouter from './Partner.routes';
import userRoutes from './User.route';
import roleRoutes from './Role.route';
import alimentationRoutes from './Alimentation.routes';
import eventRoutes from './Event.route';
import nutritionRoutes from './Nutrition.routes';
import offRoutes from './Openfoodfacts.routes';

const router = Router();

router.use('/exercices', exerciceRoutes);
router.use('/programs', programRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/partners', partnerRouter);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/alimentation',alimentationRoutes);
router.use('/events', eventRoutes);
router.use('/nutrition', nutritionRoutes);
router.use('/off', offRoutes);
export default router;