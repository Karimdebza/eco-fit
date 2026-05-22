import { Sequelize, DataTypes } from 'sequelize';
import defineExercise from '../../Model/Exercise';

describe('Exercise Model', () => {
  let sequelize: Sequelize;
  let Exercise: ReturnType<typeof defineExercise>;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });
    Exercise = defineExercise(sequelize, DataTypes);
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create an exercise', async () => {
    const exerciseData = {
      id_exercise: 1,
      name: 'Squat',
      accessibility: 'Tous',
      time_of_exercise: 30,
      needs_materials: false,
      objectif_targeted: 'Renforcement musculaire',
      url_video: 'https://example.com/squat.mp4',
      number_of_set: 3,
      nombre_of_rep: 12,
      description: 'Un exercice classique pour renforcer les jambes.',
    };

    const exercise = await Exercise.create(exerciseData);

    expect(exercise.id_exercise).toBe(1);
    expect(exercise.name).toBe('Squat');
    expect(exercise.accessibility).toBe('Tous');
    expect(exercise.time_of_exercise).toBe(30);
    expect(exercise.needs_materials).toBe(false);
    expect(exercise.objectif_targeted).toBe('Renforcement musculaire');
    expect(exercise.url_video).toBe('https://example.com/squat.mp4');
    expect(exercise.number_of_set).toBe(3);
    expect(exercise.nombre_of_rep).toBe(12);
    expect(exercise.description).toBe('Un exercice classique pour renforcer les jambes.');
  });
});
