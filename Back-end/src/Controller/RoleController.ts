// src/controllers/RoleController.ts
import BaseController from './BaseController';
import {roleService} from '../Service/RoleService';
import db from '../Model';
import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';

export default class RoleController extends BaseController<typeof db> {
  constructor() {
    super(roleService, 'Rôle');
  }

 
    async findByLibelle(req: Request, res: Response) {
        const { libelle } = req.query;
        if (!libelle) {
        return res.status(400).json({ status: 'error', message: 'Libellé requis' });
        }
    
        const role = await roleService.findByLibelle(String(libelle));
        if (!role) {
        return res.status(404).json({ status: 'error', message: 'Rôle non trouvé' });
        }
    
        res.json({ status: 'success', data: role });
    }
}

const Controller = new RoleController();

export const roleController = {
  getAll: asyncHandler(Controller.getAll.bind(Controller)),
  getById: asyncHandler(Controller.getById.bind(Controller)),
  create: asyncHandler(Controller.create.bind(Controller)),
  update: asyncHandler(Controller.update.bind(Controller)),
  delete: asyncHandler(Controller.delete.bind(Controller)),
  findByLibelle: asyncHandler(Controller.findByLibelle.bind(Controller)),
};


