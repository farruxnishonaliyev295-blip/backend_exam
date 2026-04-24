import { Router } from "express";
import controller from "../controllers/category.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const categoryRouter = Router();

categoryRouter
  .post("/", protect, restrictTo("admin"), controller.create)
  .get("/", controller.getAll);

export default categoryRouter;