import BaseService from './BaseService'
import db from '../Model'

class EventService extends BaseService<typeof db.Event> {
  constructor() {
    super(db.Event)
  }

  findById(id: number) {
    return this.model.findOne({ where: { id_event: id } });
  }
  async joinEvent(userId: number, eventId: number) {
    const user = await db.User.findByPk(userId);
    if (!user) throw new Error('Utilisateur non trouvé');

    if (user.id_adventure && user.id_adventure !== eventId) {
      throw new Error('Vous devez quitter l\'événement actuel avant d\'en rejoindre un autre.');
    }

    user.id_adventure = eventId;
    await user.save();

    return user;
  }

  async leaveEvent(userId: number, eventId: number) {
    const user = await db.User.findByPk(userId);
    if (!user) throw new Error('Utilisateur non trouvé');

    if (user.id_adventure !== eventId) {
      throw new Error('Vous n êtes pas inscrit à cet événement');
    }
    user.id_adventure = null;
    await user.save();

    return user;
  }

}

export const eventService = new EventService();
