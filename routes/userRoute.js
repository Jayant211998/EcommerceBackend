import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/userCtrl.js";
import {
  globalErrorHandler,
  notFoundErrorHandler,
} from "../middlewares/globalErrorHandler.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const userRoute = express.Router();

userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);
userRoute.get("/profile", isLoggedIn, getUserProfile);

//Error Handler Middleware
userRoute.use(notFoundErrorHandler);
userRoute.use(globalErrorHandler);

export default userRoute;
