import { Router } from "express";
import { userController } from "../Controller/UserController";
import { authMiddleware } from "../Middleware/authenticateJWT";

const userRouter = Router();

// Routes publiques
userRouter.post("/login",    userController.signin);
userRouter.post("/register", userController.signup);

// Middleware d'authentification pour toutes les routes suivantes
userRouter.use(authMiddleware);

// Routes statiques — DOIVENT être avant /:id
userRouter.get('/check-token',       userController.getMe);
userRouter.get('/me',                userController.getMe);
userRouter.get('/search/by-name',    userController.searchByName);
userRouter.get('/search/by-email',   userController.findByEmail);
userRouter.post('/logout',           userController.logOut);
userRouter.get('/',                  userController.getAll);
userRouter.post('/',                 userController.create);

// Routes dynamiques — après les routes statiques
userRouter.get('/:id',               userController.getById);
userRouter.put('/:id',               userController.update);
userRouter.delete('/:id',            userController.delete);
userRouter.put('/disable/:id',       userController.disableUser);
userRouter.put('/:id/password',      userController.updatePassword);
userRouter.put('/:id/profile-picture', userController.updateProfilePicture);

export default userRouter;