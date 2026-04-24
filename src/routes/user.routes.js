import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { UserCreateSchema } from "../validators/user.validator.js";
import { ValidationMiddleware } from "../middlewares/validation.middleware.js";

const userRoutes = Router();

userRoutes
  .get("/", userController.getAll)
  .get("/:id", userController.getOne)
  .post("/", ValidationMiddleware(UserCreateSchema), userController.create)
  .put("/:id", ValidationMiddleware(UserCreateSchema), userController.update)
  .delete("/:id", userController.delete);

export default userRoutes;