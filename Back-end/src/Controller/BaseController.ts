import { Request, Response } from 'express';
import BaseService from '../Service/BaseService';
import { Model } from 'sequelize';

export default class BaseController<T extends Model> {
  constructor(protected service: BaseService<T>, private name: string) {}

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const items = await this.service.findAll();
      res.json({ status: 'success', data: items });
    } catch (e: any) {
      res.status(500).json({ status: 'error', message: e.message });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const item = await this.service.findById(+req.params.id);
      if (!item) {
        res.status(404).json({ status: 'error', message: `${this.name} non trouvé` });
        return;
      }
      res.json({ status: 'success', data: item });
    } catch (e: any) {
      res.status(500).json({ status: 'error', message: e.message });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const item = await this.service.create(req.body);
      res.status(201).json({ status: 'success', data: item });
    } catch (e: any) {
      res.status(400).json({ status: 'error', message: e.message });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const item = await this.service.update(+req.params.id, req.body);
      res.json({ status: 'success', data: item });
    } catch (e: any) {
      if (e.message === 'NotFound') {
        res.status(404).json({ status: 'error', message: `${this.name} non trouvé` });
      } else {
        res.status(400).json({ status: 'error', message: e.message });
      }
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      await this.service.delete(+req.params.id);
      res.json({ status: 'success', message: `${this.name} supprimé` });
    } catch (e: any) {
      if (e.message === 'NotFound') {
        res.status(404).json({ status: 'error', message: `${this.name} non trouvé` });
      } else {
        res.status(400).json({ status: 'error', message: e.message });
      }
    }
  }
}
