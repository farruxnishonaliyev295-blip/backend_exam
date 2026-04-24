import { config } from "dotenv";
import mongoose from "mongoose";

config({quiet: true})

const MONGO_URL=process.env.MONGO_URL;

if(!MONGO_URL){
    console.error("MONGO_URL not  given");
    process.exit(1)
}

export const connectDb = async () => {
    try {
        await mongoose.connect(MONGO_URL)
        return "Connect to db✅"
    } catch (error) {
        console.log(error);
        console.log("DB connection error❌");
    }
}