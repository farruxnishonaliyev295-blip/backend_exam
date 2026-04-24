import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRouter from "./auth.routes.js";
import categoryRouter from "./category.routes.js";
import productRouter from "./product.routes.js";
import feedbackRouter from "./feedback.routes.js";

const apiRoutes =Router()

apiRoutes
    .use("/users", userRoutes)
    .use("/auth",authRouter)
    .use("/category", categoryRouter)
    .use("/product", productRouter)
    .use("/feedback", feedbackRouter)

export default apiRoutes