import sequelize from '../Config/dataBase';
import { DataTypes } from 'sequelize';
import defineSubscription from '../Model/Subscription';

const Subscription = defineSubscription(sequelize, DataTypes);

async function insertTestSubscription() {
  try {
    await sequelize.authenticate();
    console.log(' Connexion à la base réussie');

    const newSubscription = await Subscription.create({
      name: 'Premium Plan',
      duration: new Date('2025-12-31'),
      price: 49.99,
      description: 'Accès complet à toutes les fonctionnalités',
      id_user: 1,
    });

    console.log(' Subscription insérée :', newSubscription.toJSON());
  } catch (error) {
    console.error(' Erreur lors de l\'insertion :', error);
  } finally {
    await sequelize.close();
  }
}

insertTestSubscription();
