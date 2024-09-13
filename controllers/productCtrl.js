import asyncHandler from "express-async-handler";
import Product from "../model/Product.js";
import Category from "../model/Category.js";
import { updateCategoryProducts } from "./categoryCtrl.js";

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

  //check category exists or not
  const categoryExists = await Category.findOne({ name: category });
  if (!categoryExists) {
    return res.status(400).json({
      success: false,
      message: "Category does not exist",
    });
  }

  //create product
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

  //add product to category
  categoryExists?.products?.push(product._id);
  await categoryExists.save();

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
  //Apply pagination
  const pagination = {};
  //next page
  if (endIdx < totalRecords) {
    pagination.next = {
      page: +page + 1,
      limit: limit,
    };
  }
  //previous page
  if (startIdx > 0) {
    pagination.prev = {
      page: page - 1,
      limit: limit,
    };
  }

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
    message: "All products fetched successfully",
    results: products.length,
    pagination,
    products,
    totalRecords,
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(400).json({
      success: false,
      message: "Product not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    product,
  });
});

export const updateProducts = asyncHandler(async (req, res) => {
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
    !name &&
    !description &&
    !brand &&
    !category &&
    !sizes &&
    !colors &&
    !images &&
    !price &&
    !totalQty
  ) {
    throw new Error("Invalid data");
  }
  const findProduct = await Product.findById(req.params.id);
  if (!findProduct) {
    return res.status(400).json({
      success: false,
      message: "Product not found",
    });
  }
  //check category exists or not
  if (category) {
    const categoryExists = await Category.findOne({ name: category });
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category does not exist",
      });
    }

    ///update product list of category if category is updated in product
    const productList = await Category.findOne({ name: category }).products;
    if (productList && !productList.includes(req.params.id)) {
      updateCategoryProducts(categoryExists, req.params.id);
    }
  }

  //check category exists or not
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      brand,
      category,
      sizes,
      colors,
      images,
      price,
      totalQty,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product,
  });
});

export const deleteProducts = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(400).json({
      success: false,
      message: "Product not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
