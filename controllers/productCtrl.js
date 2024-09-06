import asyncHandler from "express-async-handler";
import Product from "../model/Product.js";

export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    brand,
    category,
    sizes,
    colors,
    images,
    price,
    totalQty,
  } = req.body;
  if (
    !name ||
    !description ||
    !brand ||
    !category ||
    !sizes ||
    !colors ||
    !images ||
    !price ||
    !totalQty
  ) {
    throw new Error("Invalid data");
  }
  const productExists = await Product.findOne({ name });
  if (productExists) {
    return res.status(400).json({
      success: false,
      message: "Product already exists",
    });
  }
  const product = await Product.create({
    name,
    description,
    brand,
    category,
    sizes,
    colors,
    images,
    price,
    totalQty,
    user: req.userAuth,
  });
  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

export const getAllProducts = asyncHandler(async (req, res) => {
  //query
  let productQuery = Product.find();

  //search by name
  if (req.query.name) {
    productQuery = productQuery.find({
      name: {
        $regex: req.query.name,
        $options: "i", // to ignore case sensitivity
      },
    });
  }

  //search by category
  if (req.query.category) {
    productQuery = productQuery.find({
      category: {
        $regex: req.query.category,
        $options: "i", // to ignore case sensitivity
      },
    });
  }

  //search by brand
  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: {
        $regex: req.query.brand,
        $options: "i", // to ignore case sensitivity
      },
    });
  }

  //search by color
  if (req.query.color) {
    productQuery = productQuery.find({
      color: {
        $regex: req.query.color,
        $options: "i", // to ignore case sensitivity
      },
    });
  }

  //search by size
  if (req.query.size) {
    productQuery = productQuery.find({
      size: {
        $regex: req.query.size,
        $options: "i", // to ignore case sensitivity
      },
    });
  }

  //search by price
  if (req.query.price) {
    const priceRange = req.query.price.split("-");
    productQuery = productQuery.find({
      price: {
        $gte: priceRange[0],
        $lte: priceRange[1],
      },
    });
  }
  //pagination
  //page - Number of pages
  const page = req.query.page || 1;
  //limit - Number of records per page
  const limit = req.query.limit || 10;
  //startIdx - starting Index of a page
  const startIdx = (page - 1) * limit;
  //endIdx - ending Index of a page
  const endIdx = page * limit;
  //totalRecords
  const totalRecords = await Product.countDocuments();

  productQuery = productQuery.skip(startIdx).limit(limit);

  //await the query
  const products = await productQuery;

  if (products.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No products found",
    });
  }
  res.status(200).json({
    success: true,
    message: "All products",
    data: products,
  });
});
