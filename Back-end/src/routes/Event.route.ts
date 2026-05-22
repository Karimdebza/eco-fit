import { Router } from "express";
import { Controller } from "../Controller/EventController";
import { authMiddleware } from "../Middleware/authenticateJWT";

const routerEvent = Router();

routerEvent.post('/:id/join', authMiddleware, Controller.join);
routerEvent.post('/:id/leave', authMiddleware, Controller.leave);

routerEvent.get("/", Controller.getAll);
routerEvent.get("/:id", Controller.getById);
routerEvent.post("/", Controller.create);
routerEvent.put("/:id", Controller.update);
routerEvent.delete("/:id", Controller.delete);

export default routerEvent;
