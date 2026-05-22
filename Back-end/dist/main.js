"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = require("path");
// import restaurantRoutes from '../src/routes/restaurant.routes';
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const envPathMap = {
    test: '.env.test',
    development: '.env',
    production: '.env.production',
};
const env = process.env.NODE_ENV ?? 'development';
const envPath = envPathMap[env] ?? '.env';
dotenv_1.default.config({ path: (0, path_1.resolve)(process.cwd(), envPath) });
console.log(`✅ Environnement chargé : ${env}`);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
console.log(`API URL: ${process.env.API_URL}`);
