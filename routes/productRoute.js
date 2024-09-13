import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProducts,
  deleteProducts,
} from "../controllers/productCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const productRoute = express.Router();

productRoute.post("/", isLoggedIn, createProduct);
productRoute.get("/", getAllProducts);
productRoute.get("/:id", getProductById);
productRoute.put("/:id", isLoggedIn, updateProducts);
productRoute.delete("/:id", isLoggedIn, deleteProducts);

export default productRoute;
