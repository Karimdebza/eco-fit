import db from '../Model';
import BaseService from './BaseService';
import { Op } from 'sequelize';
import axios from 'axios';
import { IExercise } from '../Interface/IExercise';
import { ExerciseTranslation } from '../Interface/ExerciseTranslation';
import { ExerciseImage } from '../Interface/ExerciseImage';
import { ExerciseVideo } from '../Interface/ExerciseVideo';
import { WgerApiResponse } from '../Interface/WgerApiResponse';
import { ExerciseDetail } from '../Interface/ExerciseDetail';

class ExerciseService extends BaseService<typeof db.Exercise> {
  constructor() {
    super(db.Exercise);
  }

async getAllExercises() {
  const { data: exercisesData } = await axios.get<WgerApiResponse<IExercise>>('https://wger.de/api/v2/exercise/', {
    params: { language: 2, limit: 20 },
  });

  const { data: translationsData } = await axios.get<WgerApiResponse<ExerciseTranslation>>('https://wger.de/api/v2/exercise-translation/', {
    params: { language: 2, limit: 1000 },
  });

  const { data: imagesData } = await axios.get<WgerApiResponse<ExerciseImage>>('https://wger.de/api/v2/exerciseimage/', {
    params: { limit: 1000 },
  });

  const { data: videosData } = await axios.get<WgerApiResponse<ExerciseVideo>>('https://wger.de/api/v2/video/', {
    params: { limit: 1000 },
  });

  const exercises = exercisesData.results;

  const enrichedExercises = exercises.map(exercise => {
    const translation = translationsData.results.find(t => t.exercise === exercise.id);
    const exerciseImages = imagesData.results.filter(img => img.exercise === exercise.id);
    const exerciseVideos = videosData.results.filter(video => video.exercise === exercise.id);

    return {
      id: exercise.id,
      uuid: exercise.uuid,
      created: exercise.created,
      last_update: exercise.last_update,
      category: exercise.category,
      muscles: exercise.muscles,
      muscles_secondary: exercise.muscles_secondary,
      equipment: exercise.equipment,
      license_author: exercise.license_author,
      name: translation?.name || null,
      description: translation?.description || null,
      images: exerciseImages.map(img => ({
        url: img.image,
        is_main: img.is_main,
      })),
      videos: exerciseVideos.map(video => ({
        url: video.video,
        is_main: video.is_main,
        duration: video.duration,
        width: video.width,
        height: video.height,
        codec: video.codec,
      })),
    };
  });

 return {
  count: exercisesData.count,
  next: exercisesData.next,
  previous: exercisesData.previous,
  results: enrichedExercises
};
}

async getExerciseDetail(id: number): Promise<ExerciseDetail | null> {
  const [exerciseRes, translationsRes, imagesRes, videosRes] = await Promise.all([
    axios.get<IExercise>(`https://wger.de/api/v2/exercise/${id}/`),
    axios.get<WgerApiResponse<ExerciseTranslation>>('https://wger.de/api/v2/exercise-translation/', {
      params: { language: 2, limit: 1000 },
    }),
    axios.get<WgerApiResponse<ExerciseImage>>('https://wger.de/api/v2/exerciseimage/', {
      params: { limit: 1000 },
    }),
    axios.get<WgerApiResponse<ExerciseVideo>>('https://wger.de/api/v2/video/', {
      params: { limit: 1000 },
    }),
  ]);

  const ex = exerciseRes.data;
  const translation = translationsRes.data.results.find(t => t.exercise === id);
  const images = imagesRes.data.results.filter(img => img.exercise === id);
  const videos = videosRes.data.results.filter(v => v.exercise === id);

  return {
    id: ex.id,
    uuid: ex.uuid,
    created: ex.created,
    last_update: ex.last_update,
    category: ex.category,
    muscles: ex.muscles,
    muscles_secondary: ex.muscles_secondary,
    equipment: ex.equipment,
    license_author: ex.license_author,
    name: translation?.name ?? null,
    description: translation?.description ?? null,
    images: images.map(img => ({
      url: img.image,
      is_main: img.is_main,
    })),
    videos: videos.map(v => ({
      url: v.video,
      is_main: v.is_main,
      duration: v.duration,
      width: v.width,
      height: v.height,
      codec: v.codec,
    })),
  };
}


  async searchExercisesByName(name: string) {
    return this.model.findAll({
      where: {
        name: { [Op.like]: `%${name}%` },
      },
    });
  }

  async getFilteredExercises(filters: any) {
    const where: any = {};

    const levelMap: Record<number, string> = {
      1: 'Débutant',
      2: 'Intermédiaire',
      3: 'Avancé',
    };

    if (filters.name) {
      where.name = { [Op.like]: `%${filters.name}%` };
    }

    if (filters.accessibility) {
      const levelNum = Number(filters.accessibility);
      if (!isNaN(levelNum) && levelMap[levelNum]) {
        where.accessibility = levelMap[levelNum];
      } else {
        where.accessibility = filters.accessibility;
      }
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.needs_materials !== undefined) {
      const needsMaterials = filters.needs_materials === 'true' || filters.needs_materials === '1';
      where.needs_materials = needsMaterials;
    }

    return this.model.findAll({ where });
  }

  async countExercises() {
    return this.model.count();
  }
}

export const exerciseService = new ExerciseService();
