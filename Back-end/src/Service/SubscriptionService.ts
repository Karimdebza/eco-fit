import db from '../Model';
import BaseService from './BaseService';

class SubscriptionService extends BaseService<typeof db.Subscription> {
  constructor() {
    super(db.Subscription);
  }

  async renew(id: number) {
  const subscription = await this.findById(id);
  const newExpirationDate = new Date(subscription.durer);
  newExpirationDate.setMonth(newExpirationDate.getMonth() + 1);

  return subscription.update({ durer: newExpirationDate });
}

  async cancel(id: number) {
  const subscription = await this.findById(id);
  return subscription.update({ status: 'cancelled' });
}
}

export const subscriptionService = new SubscriptionService();