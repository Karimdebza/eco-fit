import { eventService } from '../../Service/EventService';
import db from '../../Model';

jest.mock('../../Model', () => ({
  Event: {
    findOne: jest.fn(),
  },
  User: {
    findByPk: jest.fn(),
  },
}));

describe('Service Event', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('doit appeler Event.findOne avec l id_event correct', async () => {
      const evenementMock = { id_event: 1, title: 'Evenement Test' };
      (db.Event.findOne as jest.Mock).mockResolvedValue(evenementMock);

      const resultat = await eventService.findById(1);

      expect(db.Event.findOne).toHaveBeenCalledWith({ where: { id_event: 1 } });
      expect(resultat).toBe(evenementMock);
    });
  });

  describe('joinEvent', () => {
    it('doit renvoyer une erreur si l utilisateur est introuvable', async () => {
      (db.User.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(eventService.joinEvent(1, 10)).rejects.toThrow('Utilisateur non trouvé');
    });

    it('doit renvoyer une erreur si l utilisateur est deja inscrit a un autre evenement', async () => {
      const userMock = { id_adventure: 5, save: jest.fn() };
      (db.User.findByPk as jest.Mock).mockResolvedValue(userMock);

      await expect(eventService.joinEvent(1, 10)).rejects.toThrow(
        "Vous devez quitter l'événement actuel avant d'en rejoindre un autre."
      );
      expect(userMock.save).not.toHaveBeenCalled();
    });

    it('doit mettre a jour id_adventure et sauvegarder l utilisateur', async () => {
      const userMock = { id_adventure: null, save: jest.fn() };
      (db.User.findByPk as jest.Mock).mockResolvedValue(userMock);

      const resultat = await eventService.joinEvent(1, 10);

      expect(userMock.id_adventure).toBe(10);
      expect(userMock.save).toHaveBeenCalled();
      expect(resultat).toBe(userMock);
    });
  });

  describe('leaveEvent', () => {
    it('doit renvoyer une erreur si l utilisateur est introuvable', async () => {
      (db.User.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(eventService.leaveEvent(1, 10)).rejects.toThrow('Utilisateur non trouvé');
    });

    it('doit renvoyer une erreur si l utilisateur n est pas inscrit a l evenement', async () => {
      const userMock = { id_adventure: 5, save: jest.fn() };
      (db.User.findByPk as jest.Mock).mockResolvedValue(userMock);

      await expect(eventService.leaveEvent(1, 10)).rejects.toThrow(
        "Vous n êtes pas inscrit à cet événement"
      );
      expect(userMock.save).not.toHaveBeenCalled();
    });

    it('doit remettre id_adventure a null et sauvegarder l utilisateur', async () => {
      const userMock = { id_adventure: 10, save: jest.fn() };
      (db.User.findByPk as jest.Mock).mockResolvedValue(userMock);

      const resultat = await eventService.leaveEvent(1, 10);

      expect(userMock.id_adventure).toBeNull();
      expect(userMock.save).toHaveBeenCalled();
      expect(resultat).toBe(userMock);
    });
  });
});
