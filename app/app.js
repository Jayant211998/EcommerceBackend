import express from "express";
import dbConnect from "../config/dbConnect.js";
import dotenv from "dotenv";
import userRoute from "../routes/userRoute.js";
dotenv.config();
//db connect
dbConnect();
const app = express();

//pass incoming data
app.use(express.json());

//routes
app.use("/", userRoute);

export default app;
