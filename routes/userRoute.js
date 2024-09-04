import express from "express";
import { registerUser } from "../controllers/userCtrl.js";

const userRoute = express.Router();

userRoute.post("/api/v1/users/register", registerUser);

export default userRoute;
