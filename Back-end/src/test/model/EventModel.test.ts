import { Sequelize, DataTypes } from 'sequelize';
import defineEventModel from '../../Model/Event';

describe('Event model', () => {
  let sequelize: Sequelize;
  let Event: ReturnType<typeof defineEventModel>;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });
    Event = defineEventModel(sequelize, DataTypes);
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create an Event', async () => {
    const eventData = {
      title: 'Test Event',
      place: 'Paris',
      image: 'http://image.url/img.jpg',
      date_of_event: new Date('2025-06-01'),
      themes: 'Music, Art',
      nombre_of_participant: 100,
      rating: 5,
      description: 'This is a test event',
    };

    const event = await Event.create(eventData);

    expect(event.id_event).toBeDefined();
    expect(event.title).toBe(eventData.title);
    expect(event.place).toBe(eventData.place);
    expect(event.image).toBe(eventData.image);
    expect(event.date_of_event.toISOString()).toBe(eventData.date_of_event.toISOString());
    expect(event.themes).toBe(eventData.themes);
    expect(event.nombre_of_participant).toBe(eventData.nombre_of_participant);
    expect(event.rating).toBe(eventData.rating);
    expect(event.description).toBe(eventData.description);
  });
});
