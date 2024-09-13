import asyncHandler from "express-async-handler";
import Category from "../model/Category.js";
import Product from "../model/Product.js";

export const createCategory = asyncHandler(async (req, res) => {
  const { name, image } = req.body;
  if (!name || !image) {
    throw new Error("Invalid data! Please provide name and image");
  }
  const exist = await Category.findOne({ name });
  if (exist) {
    return res.status(400).json({
      success: false,
      message: "Category already exists",
    });
  }
  const category = await Category.create({
    name: name.toLowerCase(),
    image,
    user: req.userAuth,
  });
  res.status(201).json({
    success: true,
    message: "Category created successfully",
    category,
  });
});

export const getAllCategory = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json({
    success: true,
    categories,
  });
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(400).json({
      success: false,
      message: "Category not found",
    });
  }
  res.status(200).json({
    success: true,
    category,
  });
});

export const updateCategoryById = asyncHandler(async (req, res) => {
  const { name, image } = req.body;
  if (!name && !image) {
    throw new Error("Invalid data! Please provide name and image");
  }
  const category = await Category.findByIdAndUpdate(req.params.id);
  if (!category) {
    return res.status(400).json({
      success: false,
      message: "Category not found",
    });
  }
  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
      image,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    success: true,
    category: updatedCategory,
  });
});

export const deleteCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return res.status(400).json({
      success: false,
      message: "Category not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});

export const updateCategoryProducts = (updatedCategory, productId) => {
  //adding product to updated category
  updatedCategory.products.push(productId);
  updatedCategory.save();

  //removing product from old category
  const oldCategory = Product.findById(productId).categories;
  oldCategory.pull(updatedCategory._id);
  oldCategory.save();
};
