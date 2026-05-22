import { Router } from "express";
import { roleController } from "../Controller/RoleController";

const roleRouter = Router();



roleRouter.get("/", roleController.getAll);
roleRouter.get("/:id", roleController.getById);
roleRouter.get("/:id/by-label", roleController.findByLibelle);
roleRouter.post("/", roleController.create);
roleRouter.put("/:id", roleController.update);
roleRouter.delete("/:id", roleController.delete);

export default roleRouter;


