import { response, Router } from "express";
import { userController } from "../Controller/UserController";
import { authMiddleware } from "../Middleware/authenticateJWT";
import { Request, Response } from 'express';

const userRouter = Router();

// Routes publiques
userRouter.post("/login", userController.signin);
userRouter.post("/register", userController.signup);

// Middleware d'authentification pour toutes les routes suivantes
userRouter.use(authMiddleware);

// Routes protégées


userRouter.get('/check-token', userController.getMe)
userRouter.post('/logout', userController.logOut);
userRouter.get("/", userController.getAll);
userRouter.get("/search/by-name", userController.searchByName);
userRouter.get('/me', authMiddleware, userController.getMe);

userRouter.get("/:id", userController.getById);
userRouter.get("/search/by-email", userController.findByEmail);
userRouter.put("/disable/:id", userController.disableUser);
userRouter.post("/", userController.create);
userRouter.put("/:id", userController.update);
userRouter.delete("/:id", userController.delete);

userRouter.put("/:id_user/password", userController.updatePassword);
userRouter.put("/:id_user/profile-picture", userController.updateProfilePicture);


export default userRouter;