import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

export const isLoggedIn = (req, res, next) => {
  //Get token from header
  const token = getTokenFromHeader(req);
  //Verify token
  const decodedUser = verifyToken(token);
  //Save the user into req obj
  req.userAuth = decodedUser.id;
  if (!decodedUser) {
    throw new Error("Invalid/Expired token, Please login again");
  } else {
    next();
  }
};
