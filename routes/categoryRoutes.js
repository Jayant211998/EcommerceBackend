import express from "express";
import {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
} from "../controllers/categoryCtrl.js";

import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const categoryRoute = express.Router();
categoryRoute.post("/", isLoggedIn, createCategory);
categoryRoute.get("/", getAllCategory);
categoryRoute.get("/:id", getCategoryById);
categoryRoute.put("/:id", isLoggedIn, updateCategoryById);
categoryRoute.delete("/:id", isLoggedIn, deleteCategoryById);

export default categoryRoute;
