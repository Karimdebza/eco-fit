import { Request, Response } from 'express';
import BaseController from './BaseController';
import db from '../Model';
import { eventService } from '../Service/EventService';

class EventController extends BaseController<typeof db.Event> {
  constructor() {
    super(eventService, 'Event');
  }
  public async getById(req: Request, res: Response): Promise<void> {
  try {
    const item = await this.service.findById(+req.params.id);
    if (!item) {
      res.status(404).json({ status: 'error', message: `Event non trouvé` });
      return;
    }
    res.json({ status: 'success', data: item });
  } catch (e: any) {
    console.error('Erreur getById event:', e);
    res.status(500).json({ status: 'error', message: e.message });
  }
}

  async join(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const eventId = Number(req.params.id);

    try {
      const updatedUser = await eventService.joinEvent(userId, eventId);
       res.json({ status: 'success', message: 'Rejoint avec succès' });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async leave(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const eventId = Number(req.params.id);

    try {
      const updatedUser = await eventService.leaveEvent(userId, eventId);
       res.json({ status: 'success', message: 'Quitte avec succès' }); 
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

}

export const eventController = new EventController();


export const Controller = {
  getAll: eventController.getAll.bind(eventController),
  getById: eventController.getById.bind(eventController),
  create: eventController.create.bind(eventController),
  update: eventController.update.bind(eventController),
  delete: eventController.delete.bind(eventController),
  join: eventController.join.bind(eventController),
  leave: eventController.leave.bind(eventController),
};
