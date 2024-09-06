import User from "../model/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";

//Hash  password
const salt = bcrypt.genSaltSync(10);
const hashPassword = (password) => {
  return bcrypt.hashSync(password, salt);
};
// Create a user
export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!email || !password || !fullName) {
    throw new Error("Invalid data");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }
  const user = await User.create({
    fullName,
    email,
    password: hashPassword(password),
  });
  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("Invalid data");
  }
  const userExists = await User.findOne({ email });
  if (!userExists) {
    return res.status(401).json({
      success: false,
      message: "User not found. Please register.",
    });
  } else if (userExists && !bcrypt.compareSync(password, userExists.password)) {
    return res.status(401).json({
      success: false,
      message: "Invalid password",
    });
  }
  res.status(201).json({
    success: true,
    message: "User login successfully",
    userExists,
    token: generateToken(userExists._id),
  });
});

export const getUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
  });
});
