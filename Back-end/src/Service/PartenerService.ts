import db from '../Model';
import BaseService from './BaseService';

class PartnerService extends BaseService<typeof db.Partner> {
  constructor() {
    super(db.Partner);
  }
}

export const partnerService = new PartnerService();
