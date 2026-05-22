'use strict'

import sequelize, { DataTypes } from '../Config/dataBase';
import UserModel from './User'
import RoleModel from './Role'
import SubscriptionModel from './Subscription'
import EventModel from './Event'
import PartnerModel from './Partener'
import ExerciseModel from './Exercise'
import ProgramModel from './program'
import ProgrammeExercise from './ProgrammeExerciseModel'

const models: any = {};

models.User = UserModel(sequelize, DataTypes);
models.Role = RoleModel(sequelize, DataTypes);
models.Subscription = SubscriptionModel(sequelize, DataTypes);
models.Event = EventModel(sequelize, DataTypes);
models.Partner = PartnerModel(sequelize, DataTypes);
models.Exercise = ExerciseModel(sequelize, DataTypes);
models.Programme = ProgramModel(sequelize, DataTypes);
models.ProgrammeExercise = ProgrammeExercise(sequelize, DataTypes);

// Initialize associations
Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

export { sequelize };
export default models;