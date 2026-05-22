import { Request, Response } from 'express';
import BaseController from './BaseController';
import { partnerService } from '../Service/PartenerService';
import asyncHandler from '../utils/asyncHandler';
import db from '../Model';

class PartnerController extends BaseController<typeof db.Partner> {
  constructor() {
    super(partnerService, 'Partenaire');
  }
}

const controller = new PartnerController();

export const partnerController = {
  getAll: asyncHandler(controller.getAll.bind(controller)),
  getById: asyncHandler(controller.getById.bind(controller)),
  create: asyncHandler(controller.create.bind(controller)),
  update: asyncHandler(controller.update.bind(controller)),
  delete: asyncHandler(controller.delete.bind(controller)),
};
