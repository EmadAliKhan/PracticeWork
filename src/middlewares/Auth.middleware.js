import { User } from "../models/User.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import JWT from "jsonwebtoken";
export const VerifyJWT = asyncHandler(async (req, res, next) => {
  try {
    //Getting Token
    const token =
      req.cookies?.AccessToken ||
      req.header("Authorization")?.replace("Bearer", "");
    if (!token) {
      res.status(401).json({
        message: "Unauthorized request..",
      });
    }
    const decodedToken = JWT.verify(token, process.env.TOKENSECRET);
    const user = User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      res.status(401).json({
        message: "Invalid Access Token..",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: error.message || "Invalid Access Token..",
    });
  }
});
