// src/Config/dataBase.ts
import dotenv from 'dotenv';
import { Sequelize, DataTypes } from 'sequelize';
import { resolve } from 'path';

const envFile = process.env.NODE_ENV === 'test'
  ? '.env.test'
  : process.env.NODE_ENV === 'dev'
    ? '.env.dev'
    : '.env.production';

dotenv.config({ path: resolve(process.cwd(), envFile) });

const databaseConfig = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'eco_fit_db',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
};

const sequelize = new Sequelize(
  process.env.DB_NAME ||'eco_fit_db',
  process.env.MYSQL_ROOT || 'root',
  process.env.MYSQL_ROOT_PASSWORD || 'rootpassword',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql',
    logging: (msg) => console.log('🗒️', msg), // Affiche les requêtes SQL dans le terminal
  }
);

export { DataTypes };
export default sequelize;
