import { Router } from "express";
import {registerValidator,loginValidator,} from "../validators/auth.validator.js";
import {ValidationMiddleware} from "../middlewares/validation.middleware.js";
import authController from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter
  .post("/register",ValidationMiddleware(registerValidator),authController.register)
  .post("/login",ValidationMiddleware(loginValidator),authController.login)
  .post("/refresh", authController.refresh);

export default authRouter;