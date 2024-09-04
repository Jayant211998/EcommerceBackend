import User from "../model/User.js";
import bcrypt from "bcryptjs";

//Hash  password
const salt = bcrypt.genSaltSync(10);
const hashPassword = (password) => {
  return bcrypt.hashSync(password, salt);
};
// Create a user
export const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;
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
};
