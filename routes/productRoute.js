import express from "express";
import { createProduct, getAllProducts } from "../controllers/productCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const productRoute = express.Router();

productRoute.post("/create", isLoggedIn, createProduct);
productRoute.get("/show", isLoggedIn, getAllProducts);

export default productRoute;
