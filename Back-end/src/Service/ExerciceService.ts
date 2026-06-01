import db, { sequelize } from '../Model';
import BaseService from './BaseService';
import { Op } from 'sequelize';

function parseJson(val: string | null): any[] {
  if (!val) return [];
  try { return JSON.parse(val); } catch { return []; }
}

function formatExercise(ex: any) {
  return {
    id:               ex.id_exercise,
    slug:             ex.slug,
    name:             ex.name,
    category:         ex.category,
    level:            ex.level,
    force:            ex.force,
    mechanic:         ex.mechanic,
    equipment:        ex.equipment,
    primaryMuscles:   parseJson(ex.primary_muscles),
    secondaryMuscles: parseJson(ex.secondary_muscles),
    instructions:     parseJson(ex.instructions),
    images:           parseJson(ex.images).map((url: string) => ({ url, is_main: false })),
  };
}

class ExerciseService extends BaseService<typeof db.Exercise> {
  constructor() {
    super(db.Exercise);
  }

  async getAllExercises(limit = 20, offset = 0) {
    const { count, rows } = await db.Exercise.findAndCountAll({
      limit,
      offset,
      order: [['name', 'ASC']],
    });
    return { count, results: rows.map(formatExercise) };
  }

  async getExerciseDetail(id: number) {
    const ex = await db.Exercise.findByPk(id);
    if (!ex) return null;
    return formatExercise(ex);
  }

  async searchExercisesByName(name: string, limit = 20) {
    const { count, rows } = await db.Exercise.findAndCountAll({
      where: { name: { [Op.like]: `%${name}%` } },
      limit,
      order: [['name', 'ASC']],
    });
    return { count, results: rows.map(formatExercise) };
  }

  async getFilteredExercises(filters: any, limit = 20, offset = 0) {
    const where: any = {};
    if (filters.category)  where.category  = filters.category;
    if (filters.level)     where.level      = filters.level;
    if (filters.equipment) where.equipment  = filters.equipment;
    if (filters.force)     where.force      = filters.force;
    if (filters.name)      where.name       = { [Op.like]: `%${filters.name}%` };

    const { count, rows } = await db.Exercise.findAndCountAll({
      where, limit, offset,
      order: [['name', 'ASC']],
    });
    return { count, results: rows.map(formatExercise) };
  }

  async countExercises() {
    return db.Exercise.count();
  }

  async getFilterOptions() {
    const query = (col: string) =>
      sequelize.query(`SELECT DISTINCT \`${col}\` FROM exercise WHERE \`${col}\` IS NOT NULL ORDER BY \`${col}\``,
        { raw: true }) as Promise<[any[], any]>;

    const [cats, levels, equips, forces] = await Promise.all([
      query('category'), query('level'), query('equipment'), query('force'),
    ]);

    return {
      categories: cats[0].map((r: any) => r.category),
      levels:     levels[0].map((r: any) => r.level),
      equipments: equips[0].map((r: any) => r.equipment),
      forces:     forces[0].map((r: any) => r.force),
    };
  }
}

export const exerciseService = new ExerciseService();