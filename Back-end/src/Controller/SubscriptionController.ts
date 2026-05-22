import { Request, Response } from 'express';
import  BaseController  from './BaseController';
import { subscriptionService } from '../Service/SubscriptionService';
import asyncHandler from '../utils/asyncHandler';
import db from '../Model';

class SubscriptionController extends BaseController<typeof db.Subscription> {
  constructor() {
    super(subscriptionService, 'Abonnement');
  }

  public async renewSubscription(req: Request, res: Response) {
  const subscription = await subscriptionService.renew(+req.params.id);
  res.json({ status: 'success', message: 'Abonnement renouvelé', data: subscription });
}

  public async cancelSubscription(req: Request, res: Response) {
    const subscription = await subscriptionService.cancel(+req.params.id);
    res.json({ status: 'success', message: 'Abonnement annulé', data: subscription });
  }
}

const controller = new SubscriptionController();

export const subscriptionController = {
  getAll: asyncHandler(controller.getAll.bind(controller)),
  getById: asyncHandler(controller.getById.bind(controller)),
  create: asyncHandler(controller.create.bind(controller)),
  update: asyncHandler(controller.update.bind(controller)),
  delete: asyncHandler(controller.delete.bind(controller)),
  renewSubscription: asyncHandler(controller.renewSubscription.bind(controller)),
  cancelSubscription: asyncHandler(controller.cancelSubscription.bind(controller)),
};
