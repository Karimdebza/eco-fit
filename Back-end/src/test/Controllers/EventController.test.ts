import { Request, Response } from 'express';
import { eventController } from '../../Controller/EventController';
import { eventService } from '../../Service/EventService';

jest.mock('../../Service/EventService');

interface RequestWithUser extends Request {
  user: {
    id: number;
  };
}

describe('EventController', () => {
  let req: Partial<RequestWithUser>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let consoleErrorMock: jest.SpyInstance;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));

    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

    req = {
      params: { id: '1' },
      user: { id: 42 },
    };

    res = {
      status: statusMock,
      json: jsonMock,
    };

    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
  });

  describe('getById', () => {
    it('renvoie un event si trouvé', async () => {
      const eventMock = { id_event: 1, title: 'Test Event' };
      (eventService.findById as jest.Mock).mockResolvedValue(eventMock);

      await eventController.getById(req as Request, res as Response);

      expect(eventService.findById).toHaveBeenCalledWith(1);
      expect(jsonMock).toHaveBeenCalledWith({ status: 'success', data: eventMock });
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('renvoie 404 si event non trouvé', async () => {
      (eventService.findById as jest.Mock).mockResolvedValue(null);

      await eventController.getById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ status: 'error', message: 'Event non trouvé' });
    });

    it('renvoie 500 en cas d erreur', async () => {
      (eventService.findById as jest.Mock).mockRejectedValue(new Error('Erreur serveur'));

      await eventController.getById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ status: 'error', message: 'Erreur serveur' });
    });
  });

  describe('join', () => {
    it('renvoie success avec utilisateur mis à jour', async () => {
      const updatedUser = { id: 42, id_adventure: 1 };
      (eventService.joinEvent as jest.Mock).mockResolvedValue(updatedUser);

      await eventController.join(req as Request, res as Response);

      expect(eventService.joinEvent).toHaveBeenCalledWith(42, 1);
    expect(jsonMock).toHaveBeenCalledWith({ status: 'success', message: 'Rejoint avec succès' });
    });

    it('renvoie 400 si erreur', async () => {
      (eventService.joinEvent as jest.Mock).mockRejectedValue(new Error('Erreur join'));

      await eventController.join(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ status: 'error', message: 'Erreur join' });
    });
  });

  describe('leave', () => {
    it('renvoie success avec utilisateur mis à jour', async () => {
      const updatedUser = { id: 42, id_adventure: null };
      (eventService.leaveEvent as jest.Mock).mockResolvedValue(updatedUser);

      await eventController.leave(req as Request, res as Response);

      expect(eventService.leaveEvent).toHaveBeenCalledWith(42, 1);
     expect(jsonMock).toHaveBeenCalledWith({ status: 'success', message: 'Quitte avec succès' });
    });

    it('renvoie 400 si erreur', async () => {
      (eventService.leaveEvent as jest.Mock).mockRejectedValue(new Error('Erreur leave'));

      await eventController.leave(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ status: 'error', message: 'Erreur leave' });
    });
  });
});
