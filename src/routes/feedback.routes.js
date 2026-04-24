import { Router } from "express";
import controller from "../controllers/feedback.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";


const feedbackRouter = Router();

feedbackRouter
  .post("/", upload.single("image"), controller.create)
  .get("/", protect, restrictTo("admin"), controller.getAll);

export default feedbackRouter;