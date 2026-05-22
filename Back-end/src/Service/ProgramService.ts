import db from '../Model';
import BaseService from './BaseService';

class ProgramService extends BaseService<typeof db.Programme> {
  constructor() {
    super(db.Programme);
  }

  async getFilteredPrograms(filters: any) {
  const where: any = {};

  const levelMap: Record<number, string> = {
    1: 'Débutant',
    2: 'Intermédiaire',
    3: 'Avancé',
  };

  if (filters.level) {
    const level = Number(filters.level);
    if (!isNaN(level) && levelMap[level]) {
      where.niveau = levelMap[level];
    }
  }

  if (filters.isForHandicap !== undefined) {
    const isForHandicap = filters.isForHandicap === 'true';
    where.needs_handicap = isForHandicap;
  }

  return this.model.findAll({ where });
}
}

export const programService = new ProgramService();
