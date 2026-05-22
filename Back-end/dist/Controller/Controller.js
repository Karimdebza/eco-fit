"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Controller {
    constructor() {
    }
    /**
     * @param res - Objet Response d'Express
     * @param data - Données à envoyer
     * @param message - Message optionnel
     */
    sendSuccess(res, data, message = 'Success') {
        res.status(200).json({
            status: 'success',
            message,
            data,
        });
    }
    /**
     * @param res - Objet Response d'Express
     * @param error - Erreur ou message d'erreur
     * @param code - Code HTTP (par défaut 500)
     */
    sendError(res, error, code = 500) {
        console.error(error);
        res.status(code).json({
            status: 'error',
            message: error.message || 'An unexpected error occurred',
        });
    }
    /**
     * @param res - Objet Response d'Express
     * @param message - Message personnalisé
     */
    sendNotFound(res, message = 'Resource not found') {
        res.status(404).json({
            status: 'error',
            message,
        });
    }
    /**
     * @param fn - Fonction asynchrone à exécuter
     */
    asyncHandler(fn) {
        return (req, res, next) => {
            Promise.resolve(fn(req, res, next)).catch((error) => this.sendError(res, error));
        };
    }
}
exports.default = Controller;
