import { Router } from "express";
import controller from "../controllers/product.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const productRouter = Router();

productRouter
    .post("/", protect, restrictTo("admin"), upload.single("image"), controller.create)
    .get("/", controller.getAll);

export default productRouter;