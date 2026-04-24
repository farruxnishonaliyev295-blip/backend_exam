import express from "express";
import cors from "cors"
import appConfig from "./config/app.config.js";
import { connectDb } from "./config/db.config.js";
import apiRoutes from "./routes/index.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express()
app.use(cors());
app.use(express.json());

app.use(errorHandler);
app.use("/api",apiRoutes)
app.use(express.urlencoded({ extended: true }));


app.use("/uploads", express.static("uploads"));

connectDb()
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
    
app.all("*splat", (req,res)=>{
    res.status(404).send({
        success: false,
        message: `Given URL ${req.url} not found`
    })
})

app.listen(appConfig.APP_PORT, () =>{
    console.log(`listening on ${appConfig.APP_PORT}`);
})