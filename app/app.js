import express from "express";
import dbConnect from "../config/dbConnect.js";
import dotenv from "dotenv";
import userRoute from "../routes/userRoute.js";
import productRoute from "../routes/productRoute.js";

dotenv.config();
//db connect
dbConnect();
const app = express();

//pass incoming data
app.use(express.json());

//routes
app.use("/api/v1/users/", userRoute);
app.use("/api/v1/products/", productRoute);
export default app;
