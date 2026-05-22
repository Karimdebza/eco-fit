// src/main.ts
import express from 'express';
import dotenv from 'dotenv';
import { resolve } from 'path';
import sequelize from './Config/dataBase';
import routes from './routes'; // Import your routes
import cors from 'cors';
import cookieParser from 'cookie-parser';
// Charger le bon fichier .env selon l'environnement
const envPath = process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.production';
dotenv.config({ path: resolve(process.cwd(), envPath) });

// Initialisation de Express
export const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:4200',  // URL de ton frontend Angular
  credentials: true,                 // autoriser l'envoi de cookies / credentials
};


app.use(cors(corsOptions));
app.use('/api', routes);



const startServer = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('🔄 Base de données synchronisée avec succès');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur le port ${PORT}`);
      console.log(`API URL: ${process.env.API_URL ?? `http://localhost:${PORT}`}`);
    });
  } catch (error) {
    console.error('❌ Échec de la synchronisation de la base de données :', error);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
